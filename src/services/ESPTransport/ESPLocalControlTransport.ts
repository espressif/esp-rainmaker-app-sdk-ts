/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMBase } from "../../ESPRMBase";
import { Status } from "../../proto/constants";
import {
  CmdGetPropertyCount,
  CmdGetPropertyValues,
  CmdSetPropertyValues,
  LocalCtrlMessage,
  LocalCtrlMsgType,
  PropertyValue,
} from "../../proto/esp_local_ctrl";
import { ESPAPIResponse } from "../../types/output";
import {
  ESPTransportConfig,
  ESPTransportInterface,
} from "../../types/transport";
import { Endpoint, StatusMessage } from "../../utils/constants";
import {
  base64ToUint8Array,
  uint8ArrayToBase64,
} from "../ESPRMHelpers/TransformEncoding";

class ESPLocalControlTransport implements ESPTransportInterface {
  private payload: Record<string, any> | undefined;
  metadata!: Record<string, any>;
  propertyInfo: Record<string, any> = {};

  constructor(transportConfig: ESPTransportConfig) {
    this.metadata = transportConfig.metadata;
  }

  /**
   * Attempts to connect to the device with retries.
   * @param nodeId - The ID of the node to connect to.
   * @param baseUrl - The base URL of the node to connect to.
   * @param securityType - The type of security to use.
   * @param pop - Proof of possession.
   * @param maxRetries - Maximum number of retry attempts.
   */
  private async connectWithRetry(
    nodeId: string,
    baseUrl: string,
    securityType: number,
    pop?: string,
    maxRetries: number = 3
  ): Promise<void> {
    let attempt = 0;

    while (attempt < maxRetries) {
      try {
        const connectionResponse =
          await ESPRMBase.ESPLocalControlAdapter.connect(
            nodeId,
            baseUrl,
            securityType,
            pop
          );

        if (connectionResponse.status === StatusMessage.SUCCESS) {
          break;
        } else {
          attempt += 1;
          continue;
        }
      } catch (connectionError: any) {
        attempt += 1;
        if (attempt === maxRetries) {
          throw new Error(
            `Failed to connect after ${maxRetries} attempts: ${connectionError.message}`
          );
        }
      }
    }
  }

  /**
   * Sets node parameters.
   * @param payload - The payload containing parameters to set.
   * @returns A promise that resolves to the API response.
   */
  async setParam(payload: Record<string, any>): Promise<ESPAPIResponse> {
    this.payload = payload;
    const isDeviceConnected =
      await ESPRMBase.ESPLocalControlAdapter.isConnected(this.payload?.node_id);

    if (!isDeviceConnected) {
      await this.connectWithRetry(
        this.payload?.node_id,
        this.metadata.baseUrl,
        this.metadata.securityType,
        this.metadata.pop
      );
    }
    const response = await this.setProperty();
    if (response) {
      return {
        status: StatusMessage.SUCCESS,
        description: "Updated param successfully",
      };
    } else {
      throw new Error(`Failed to set device params`);
    }
  }

  /**
   * Gets node parameters.
   * @param payload - The payload containing parameters to get.
   * @returns A promise that resolves to the node parameters.
   */
  async getParams(payload: Record<string, any>): Promise<Record<string, any>> {
    this.payload = payload;
    try {
      const isDeviceConnected =
        await ESPRMBase.ESPLocalControlAdapter.isConnected(
          this.payload?.node_id
        );

      if (!isDeviceConnected) {
        await this.connectWithRetry(
          this.payload?.node_id,
          this.metadata.baseUrl,
          this.metadata.securityType,
          this.metadata.pop
        );
      }
      return await this.getPropertyInfo();
    } catch (error: any) {
      throw new Error(`Failed to get device parameters: ${error.message}`);
    }
  }

  /**
   * Fetches property information from the device.
   * @returns A promise that resolves to the property information.
   */
  private async getPropertyInfo() {
    this.propertyInfo = {};
    try {
      const propertyCountRequest = await this.createGetPropertyCountRequest();
      const deviceResponse = await ESPRMBase.ESPLocalControlAdapter.sendData(
        this.payload?.node_id,
        Endpoint.LOCAL_CTRL,
        propertyCountRequest
      );
      return await this.processGetPropertyCount(deviceResponse);
    } catch (error: any) {
      throw new Error(`Error fetching property info: ${error.message}`);
    }
  }

  /**
   * Processes the response to get the property count.
   * @param response - The response from the device.
   * @returns A promise that resolves to the property values.
   */
  private async processGetPropertyCount(
    response: string
  ): Promise<Record<string, any>> {
    try {
      const encodedResponseData = base64ToUint8Array(response);
      const deserializedResponse =
        LocalCtrlMessage.deserialize(encodedResponseData);

      if (deserializedResponse.resp_get_prop_count.status === Status.Success) {
        return this.getPropertyValues(
          deserializedResponse.resp_get_prop_count.count
        );
      } else {
        throw new Error("Failed to retrieve property count from device");
      }
    } catch (error: any) {
      throw new Error(`Error processing property count: ${error.message}`);
    }
  }

  /**
   * Creates a request to get the property count.
   * @returns A promise that resolves to the request string.
   */
  private async createGetPropertyCountRequest(): Promise<string> {
    const request = new LocalCtrlMessage();
    request.msg = LocalCtrlMsgType.TypeCmdGetPropertyCount;
    request.cmd_get_prop_count = new CmdGetPropertyCount();
    return uint8ArrayToBase64(request.serialize());
  }

  /**
   * Gets property values from the device.
   * @param count - The number of properties to fetch.
   * @returns A promise that resolves to the property values.
   */
  private async getPropertyValues(count: number): Promise<Record<string, any>> {
    if (count < 1) {
      throw new Error("Property count is less than 1, no properties to fetch");
    }
    for (let i = 0; i < count; i++) {
      await this.getPropertyValue(i);
    }
    return this.propertyInfo;
  }

  /**
   * Gets a property value from the device.
   * @param index - The index of the property to fetch.
   */
  private async getPropertyValue(index: number) {
    try {
      const propertyValueRequest =
        await this.createGetPropertyValueRequest(index);
      const deviceResponse = await ESPRMBase.ESPLocalControlAdapter.sendData(
        this.payload?.node_id,
        Endpoint.LOCAL_CTRL,
        propertyValueRequest
      );
      this.processGetPropertyInfoResponse(deviceResponse);
    } catch (error: any) {
      throw new Error(`Error getting property value: ${error.message}`);
    }
  }

  /**
   * Creates a request to get a property value.
   * @param index - The index of the property to fetch.
   * @returns A promise that resolves to the request string.
   */
  private async createGetPropertyValueRequest(index: number): Promise<string> {
    const request = new LocalCtrlMessage();
    request.msg = LocalCtrlMsgType.TypeCmdSetPropertyValues;
    const payload = new CmdGetPropertyValues();
    payload.indices.push(index);
    request.cmd_get_prop_vals = payload;
    return uint8ArrayToBase64(request.serialize());
  }

  /**
   * Processes the response to get property information.
   * @param response - The response from the device.
   */
  private processGetPropertyInfoResponse(response: string): void {
    const encodedResponseData = base64ToUint8Array(response);
    const deserializedResponse =
      LocalCtrlMessage.deserialize(encodedResponseData);

    if (deserializedResponse.resp_get_prop_vals.status !== Status.Success) {
      throw new Error("Failed to get property values from device response");
    }

    const prop = deserializedResponse.resp_get_prop_vals.props[0];
    try {
      const value = JSON.parse(uint8ArrayToBase64(prop.value));
      this.propertyInfo[prop.name || "unknown"] = value;
    } catch (error: any) {
      throw new Error(`Error parsing property value: ${error.message}`);
    }
  }

  /**
   * Sets a property on the device.
   * @returns A promise that resolves to a boolean indicating success.
   */
  private async setProperty() {
    try {
      const propertyInfoRequest = await this.createSetPropertyInfoRequest(
        this.payload?.payload
      );
      const deviceResponse = await ESPRMBase.ESPLocalControlAdapter.sendData(
        this.payload?.node_id,
        Endpoint.LOCAL_CTRL,
        propertyInfoRequest
      );
      return this.processSetPropertyResponse(deviceResponse);
    } catch (error: any) {
      throw new Error(`Error setting property: ${error.message}`);
    }
  }

  /**
   * Creates a request to set property information.
   * @param json - The JSON payload containing property information.
   * @returns A promise that resolves to the request string.
   */
  private async createSetPropertyInfoRequest(
    json: Record<string, any>
  ): Promise<string> {
    const request = new LocalCtrlMessage();
    request.msg = LocalCtrlMsgType.TypeCmdSetPropertyValues;

    const payload = new CmdSetPropertyValues();
    const prop = new PropertyValue();
    prop.index = 1;

    // Serialize JSON to binary data
    let jsonData: Uint8Array;
    try {
      jsonData = new TextEncoder().encode(JSON.stringify(json));
    } catch (error: any) {
      throw new Error(`JSON serialization error: ${error.message}`);
    }

    prop.value = jsonData;
    payload.props.push(prop);
    request.cmd_set_prop_vals = payload;

    return uint8ArrayToBase64(request.serialize());
  }

  /**
   * Processes the response to set property information.
   * @param response - The response from the device.
   * @returns A boolean indicating success.
   */
  private async processSetPropertyResponse(response: string) {
    try {
      const encodedResponseData = base64ToUint8Array(response);
      const deserializedResponse =
        LocalCtrlMessage.deserialize(encodedResponseData);

      if (deserializedResponse.resp_set_prop_vals.status === Status.Success) {
        return true;
      } else {
        return false;
      }
    } catch (error: any) {
      throw new Error(
        `Error processing set property response: ${error.message}`
      );
    }
  }
}

export { ESPLocalControlTransport };
