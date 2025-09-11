/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMBase } from "./ESPRMBase";
import { rainmaker } from "./proto/esp_rmaker_user_mapping";

import {
  ESPDeviceInterface,
  ESPProvisionAdapterInterface,
  ESPProvisionStatus,
  ESPProvResponse,
  ESPProvResponseStatus,
  ESPConnectStatus,
  ESPWifiList,
} from "./types/provision";

import { ESPRMStorage } from "./services/ESPRMStorage/ESPRMStorage";
import {
  base64ToUint8Array,
  uint8ArrayToBase64,
} from "./services/ESPRMHelpers/TransformEncoding";
import { generateUUIDv4 } from "./services/ESPRMHelpers/GenerateUUID";
import {
  Endpoint,
  ProvErrorCodes,
  ESPProvProgressMessages,
  StorageKeys,
  StatusMessage,
} from "./utils/constants";
import { ESPProvError } from "./utils/error/Error";
import { NodeMappingHelper } from "./services/ESPRMHelpers/NodeMappingHelper";
import { ESPRMUser } from "./ESPRMUser";
import { NodeTimeZoneSetupService } from "./services/ESPRMHelpers/NodeTimeZoneSetupService";
import { ESPAPIResponse } from "./types/output";

class ESPDevice {
  ESPProvisionAdapter: ESPProvisionAdapterInterface =
    ESPRMBase.ESPProvisionAdapter;
  name;
  transport;
  security;
  connected?: boolean;
  username?: string;
  versionInfo?: { [key: string]: any }[];
  capabilities?: string[];
  advertisementData?: { [key: string]: any }[];

  constructor(deviceConfig: ESPDeviceInterface) {
    this.name = deviceConfig.name;
    this.transport = deviceConfig.transport;
    this.security = deviceConfig.security;
    this.connected = deviceConfig.connected;
    this.username = deviceConfig.username;
    this.versionInfo = deviceConfig.versionInfo;
    this.capabilities = deviceConfig.capabilities;
    this.advertisementData = deviceConfig.advertisementData;
  }

  /**
   * Connects to the device.
   * @returns A promise that resolves to the provisioning response.
   */
  async connect(): Promise<ESPConnectStatus> {
    const response = await this.ESPProvisionAdapter.connect(this.name);
    return response;
  }

  /**
   * Disconnect the device.
   */
  async disconnect(): Promise<void> {
    await this.ESPProvisionAdapter.disconnect(this.name);
  }

  /**
   * Gets the capabilities of the device.
   * @returns A promise that resolves to an array of capabilities.
   */
  async getDeviceCapabilities(): Promise<string[]> {
    const response = await this.ESPProvisionAdapter.getDeviceCapabilities(
      this.name
    );
    return response;
  }

  /**
   * Gets the version info of the device.
   * @returns A promise that resolves to an object containing version info.
   */
  async getDeviceVersionInfo(): Promise<{ [key: string]: any }> {
    const response = await this.ESPProvisionAdapter.getDeviceVersionInfo(
      this.name
    );
    return response;
  }

  /**
   * Starts the assisted claiming process.
   */
  async startAssistedClaiming() {
    // To Do
  }

  /**
   * Scans for available Wi-Fi networks.
   * @returns A promise that resolves to an array of Wi-Fi networks.
   */
  async scanWifiList(): Promise<ESPWifiList[]> {
    return this.ESPProvisionAdapter.scanWifiList(this.name);
  }

  /**
   * Provisions the device with the given Wi-Fi credentials.
   * @param ssid - The SSID of the Wi-Fi network.
   * @param passphrase - The passphrase of the Wi-Fi network.
   * @param onProgress - A callback function to report progress.
   * @param groupId (optional) - The unique identifier of the group to which the node should be added.
   */
  async provision(
    ssid: string,
    passphrase: string,
    onProgress: (message: ESPProvResponse) => void,
    groupId?: string
  ): Promise<void> {
    // Start user device association
    try {
      const secretKey = generateUUIDv4();
      onProgress({
        status: ESPProvResponseStatus.onProgress,
        description: ESPProvProgressMessages.START_ASSOCIATION,
      });
      const associationConfigRequest =
        await this.createAssociationConfigRequest(secretKey);
      if (associationConfigRequest) {
        onProgress({
          status: ESPProvResponseStatus.onProgress,
          description: ESPProvProgressMessages.ASSOCIATION_CONFIG_CREATED,
        });

        onProgress({
          status: ESPProvResponseStatus.onProgress,
          description: ESPProvProgressMessages.SENDING_ASSOCIATION_CONFIG,
        });
        const responseData = await this.sendData(
          Endpoint.CLOUD_USER_ASSOCIATION,
          associationConfigRequest
        );
        onProgress({
          status: ESPProvResponseStatus.onProgress,
          description: ESPProvProgressMessages.ASSOCIATION_CONFIG_SENT,
        });

        // Fetch node ID
        const nodeID = this.processResponse(responseData, onProgress);

        const provisionStatus = await this.ESPProvisionAdapter.provision(
          this.name,
          ssid,
          passphrase
        );

        if (provisionStatus === ESPProvisionStatus.success) {
          onProgress({
            status: ESPProvResponseStatus.succeed,
            description: ESPProvProgressMessages.DEVICE_PROVISIONED,
          });

          // Start user node mapping
          // Retry logic for user node mapping request
          const maxRetries = 5;
          let attempt = 0;
          let nodeMappingRequestId;

          while (attempt < maxRetries) {
            try {
              nodeMappingRequestId = await NodeMappingHelper.addNodeMapping(
                nodeID,
                secretKey,
                groupId
              );
              if (nodeMappingRequestId) {
                break;
              }
            } catch (error: any) {
              if (error instanceof TypeError) {
                // This is likely a network error (e.g., no internet, server unreachable), continue retrying
                attempt++;
                await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait for 5 seconds before next retry
              } else {
                // This is an API error (e.g., 404, 500)
                throw error;
              }
            }
          }

          if (!nodeMappingRequestId) {
            throw new ESPProvError(
              ProvErrorCodes.FAILED_USER_NODE_MAPPING_REQUEST_CREATION
            );
          }

          // Check user node mapping request till the timeout
          const checkNodeMappingStatus = async () => {
            try {
              // Check the status of the node mapping request
              const nodeMappingStatus =
                await NodeMappingHelper.getNodeMappingStatus(
                  nodeMappingRequestId
                );

              // If the status is timed out, clear the interval and throw an error
              if (nodeMappingStatus === StatusMessage.TIMEDOUT) {
                clearInterval(intervalId);
                throw new ESPProvError(
                  ProvErrorCodes.FAILED_USER_NODE_MAPPING_CLOUD_TIMEOUT
                );
              }

              // If the status is confirmed, proceed with further steps
              if (nodeMappingStatus === StatusMessage.CONFIRMED) {
                clearInterval(intervalId);
                onProgress({
                  status: ESPProvResponseStatus.succeed,
                  description:
                    ESPProvProgressMessages.USER_NODE_MAPPING_SUCCEED,
                });

                // Fetch the user's time zone
                const userTimeZone =
                  await NodeTimeZoneSetupService.getUserTimeZone();
                if (!userTimeZone) return;

                // Fetch the node configuration
                const nodeConfig =
                  await NodeTimeZoneSetupService.getNodeConfig(nodeID);

                // Extract time service parameters from the node configuration
                const timeServiceParams =
                  await NodeTimeZoneSetupService.extractTimeServiceFromNodeConfig(
                    nodeConfig
                  );
                if (!timeServiceParams) return;

                // Construct the payload for setting the node's time zone
                const timeZonePayload =
                  NodeTimeZoneSetupService.constructTimeZonePayload(
                    nodeID,
                    timeServiceParams,
                    userTimeZone
                  );

                // Callback to report progress when initiating node time zone setup
                const onInitiatingNodeTimeZoneSetup = () => {
                  onProgress({
                    status: ESPProvResponseStatus.onProgress,
                    description:
                      ESPProvProgressMessages.INITIATING_NODE_TIMEZONE_SETUP,
                  });
                };

                // Wait for the node to be connected before proceeding
                const isConnected =
                  await NodeTimeZoneSetupService.waitForNodeConnectivity(
                    nodeID,
                    onInitiatingNodeTimeZoneSetup
                  );

                if (!isConnected) return;

                // Callback to report progress when setting the node's time zone
                const onSettingNodeTimeZone = () => {
                  onProgress({
                    status: ESPProvResponseStatus.onProgress,
                    description: ESPProvProgressMessages.SETTING_NODE_TIMEZONE,
                  });
                };

                // Send the time zone payload to the node and set the time zone
                const response = await NodeTimeZoneSetupService.setNodeTimeZone(
                  timeZonePayload,
                  onSettingNodeTimeZone
                );

                // If the time zone setup is successful, report success
                if (response.status === StatusMessage.SUCCESS) {
                  onProgress({
                    status: ESPProvResponseStatus.succeed,
                    description:
                      ESPProvProgressMessages.NODE_TIMEZONE_SETUP_SUCCEED,
                  });
                }
              }
            } catch (error) {
              // Clear the interval and rethrow the error in case of failure
              clearInterval(intervalId);
              throw error;
            }
          };

          const intervalId = setInterval(checkNodeMappingStatus, 5000);
        } else {
          throw new ESPProvError(ProvErrorCodes.FAILED_PROV);
        }
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Sets the proof of possession for the device.
   * @param proofOfPossession - The proof of possession string.
   * @returns A promise that resolves to a boolean indicating whether the proof of possession was successfully set.
   */
  async setProofOfPossession(proofOfPossession: string): Promise<boolean> {
    return this.ESPProvisionAdapter.setProofOfPossession(
      this.name,
      proofOfPossession
    );
  }

  /**
   * Sends data to the device.
   * @param endPoint - The endpoint to send data to.
   * @param data - The data to send.
   * @returns A promise that resolves to the response data.
   */
  async sendData(endPoint: string, data: string): Promise<string> {
    const returnData = await this.ESPProvisionAdapter.sendData(
      this.name,
      endPoint,
      data
    );
    return returnData;
  }

  /**
   * Initialize session with the device.
   * @returns A promise that resolves to a boolean indicating whether the session was successfully initialized.
   */
  async initializeSession(): Promise<boolean> {
    const isSessionInitialized =
      await this.ESPProvisionAdapter.initializeSession(this.name);
    return isSessionInitialized;
  }

  /**
   * Creates an association configuration request.
   * @param secretKey - The secret key for the association.
   * @returns A promise that resolves to the request string.
   */
  private async createAssociationConfigRequest(
    secretKey: string
  ): Promise<string> {
    try {
      const idToken = await ESPRMStorage.getItem(StorageKeys.IDTOKEN);
      if (!idToken) {
        throw new ESPProvError(ProvErrorCodes.MISSING_ID_TOKEN);
      }

      const configRequest = new rainmaker.CmdSetUserMapping();
      configRequest.SecretKey = secretKey;
      configRequest.UserID = ESPRMUser.userId;

      const payload = new rainmaker.RMakerConfigPayload();
      payload.msg = rainmaker.RMakerConfigMsgType.TypeCmdSetUserMapping;
      payload.cmd_set_user_mapping = configRequest;
      const serializedPayload = payload.serialize();
      return uint8ArrayToBase64(serializedPayload);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Processes the response data from the device.
   * @param responseData - The response data from the device.
   * @param onProgress - A callback function to report progress.
   * @returns The node ID extracted from the response data.
   */
  private processResponse(
    responseData: string,
    onProgress: (message: ESPProvResponse) => void
  ): string {
    let nodeId: string | null | undefined;

    try {
      onProgress({
        status: ESPProvResponseStatus.onProgress,
        description: ESPProvProgressMessages.DECODING_RESPONSE_DATA,
      });
      const encodedResponseData = base64ToUint8Array(responseData);
      const response =
        rainmaker.RMakerConfigPayload.deserialize(encodedResponseData);
      if (
        response.resp_set_user_mapping?.Status ===
        rainmaker.RMakerConfigStatus.Success
      ) {
        nodeId = response.resp_set_user_mapping.NodeId;

        if (!nodeId) {
          throw new ESPProvError(ProvErrorCodes.MISSING_NODE_ID);
        }

        onProgress({
          status: ESPProvResponseStatus.onProgress,
          description: ESPProvProgressMessages.DECODED_NODE_ID,
          data: { nodeId },
        });
      } else {
        throw new ESPProvError(ProvErrorCodes.FAILED_USER_DEVICE_ASSOCIATION);
      }
    } catch (error) {
      throw error; // Re-throwing the error for further handling if needed
    }

    return nodeId; // Now guaranteed to be a valid string
  }

  /**
   * Initiates a user node mapping request.
   * @param requestBody - The request body for the user node mapping.
   * @returns A promise that resolves to the response from the API.
   */
  async initiateUserNodeMapping(
    requestBody: Record<string, any> = {}
  ): Promise<any> {
    return await NodeMappingHelper.initiateUserNodeMapping(requestBody);
  }

  /**
   * Verifies the mapping between a user and a node.
   * @param requestBody - The request body for the user node mapping verification.
   * @returns A promise that resolves to the response from the API.
   */
  async verifyUserNodeMapping(
    requestBody: Record<string, any> = {}
  ): Promise<ESPAPIResponse> {
    return await NodeMappingHelper.verifyUserNodeMapping(requestBody);
  }

  /**
   * Sets the network credentials for the device.
   * @param ssid - The SSID of the Wi-Fi network.
   * @param passphrase - The passphrase of the Wi-Fi network.
   */
  async setNetworkCredentials(
    ssid: string,
    passphrase: string
  ): Promise<ESPProvisionStatus> {
    // Start user device association
    const response = await this.ESPProvisionAdapter.provision(
      this.name,
      ssid,
      passphrase
    );
    return response;
  }
}

export { ESPDevice };
