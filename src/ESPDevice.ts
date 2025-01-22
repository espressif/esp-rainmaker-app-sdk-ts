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
  ESPProvResponse,
  ESPProvResponseStatus,
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

class ESPDevice {
  ESPProvisionAdapter: ESPProvisionAdapterInterface =
    ESPRMBase.ESPProvisionAdapter;
  name;
  transport;
  security;

  constructor(deviceConfig: ESPDeviceInterface) {
    this.name = deviceConfig.name;
    this.transport = deviceConfig.transport;
    this.security = deviceConfig.security;
  }

  /**
   * Connects to the device.
   * @returns A promise that resolves to the provisioning response.
   */
  async connect(): Promise<ESPProvResponse> {
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
   */
  async provision(
    ssid: string,
    passphrase: string,
    onProgress: (message: ESPProvResponse) => void
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

        if (provisionStatus === 0) {
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
                secretKey
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
          let intervalId = setInterval(async () => {
            let nodeMappingStatus = undefined;
            nodeMappingStatus =
              await NodeMappingHelper.getNodeMappingStatus(
                nodeMappingRequestId
              );
            if (nodeMappingStatus === StatusMessage.TIMEDOUT) {
              throw new ESPProvError(
                ProvErrorCodes.FAILED_USER_NODE_MAPPING_CLOUD_TIMEOUT
              );
            }
            if (nodeMappingStatus === StatusMessage.CONFIRMED) {
              onProgress({
                status: ESPProvResponseStatus.succeed,
                description: ESPProvProgressMessages.USER_NODE_MAPPING_SUCCEED,
              });
              clearInterval(intervalId);
            }
          }, 5000);
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
        });
      } else {
        throw new ESPProvError(ProvErrorCodes.FAILED_USER_DEVICE_ASSOCIATION);
      }
    } catch (error) {
      throw error; // Re-throwing the error for further handling if needed
    }

    return nodeId; // Now guaranteed to be a valid string
  }
}

export { ESPDevice };
