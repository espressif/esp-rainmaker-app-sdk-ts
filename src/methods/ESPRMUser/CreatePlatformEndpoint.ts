/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMUser } from "../../ESPRMUser";
import { ESPRMAPIManager } from "../../services/ESPRMAPIManager";
import { ESPRMStorage } from "../../services/ESPRMStorage/ESPRMStorage";
import { CreatePlatformEndpointRequest } from "../../types/input";
import {
  APIEndpoints,
  HTTPMethods,
  StatusMessage,
  StorageKeys,
} from "../../utils/constants";

/**
 * Augments the `ESPRMUser` class with the `createPlatformEndpoint` method,
 * allowing the user to register a mobile platform endpoint for push notifications.
 *
 * The `createPlatformEndpoint` method sends a request to create a platform endpoint
 * for push notifications based on the provided parameters.
 */
declare module "../../ESPRMUser" {
  interface ESPRMUser {
    /**
     * Creates a platform endpoint for push notifications.
     *
     * @param createPlatformEndpointRequestParams - The parameters required to create the platform endpoint.
     * @returns A promise resolving to the platform endpoint.
     */
    createPlatformEndpoint(
      createPlatformEndpointRequestParams: CreatePlatformEndpointRequest
    ): Promise<string>;
  }
}

/**
 * Adds the `createPlatformEndpoint` method to the `ESPRMUser` prototype.
 *
 * This method constructs a request to create a platform endpoint for push notifications
 * by preparing the request payload and calling the appropriate API endpoint.
 *
 * @param createPlatformEndpointRequestParams - The parameters required to create the platform endpoint.
 * @returns A promise that resolves to a string representing the platform endpoint.
 */
ESPRMUser.prototype.createPlatformEndpoint = async function (
  createPlatformEndpointRequestParams: CreatePlatformEndpointRequest
): Promise<string> {
  const requestData = createRequestData(createPlatformEndpointRequestParams);

  const requestConfig = {
    url: APIEndpoints.USER_PUSH_NOTIFICATION_MOBILE_PLATFORM_ENDPOINT,
    method: HTTPMethods.POST,
    data: requestData,
  };

  const response = await ESPRMAPIManager.authorizeRequest(requestConfig);
  if (response.status === StatusMessage.SUCCESS) {
    const userDeviceTokenMap = {
      [ESPRMUser.userId]: createPlatformEndpointRequestParams.deviceToken,
    };
    ESPRMStorage.setItem(
      StorageKeys.USER_DEVICETOKEN_MAP,
      JSON.stringify(userDeviceTokenMap)
    );
  }
  return response.platform_endpoint_arn;
};

/**
 * Helper function to construct the request payload for creating a platform endpoint.
 *
 * This function transforms the input parameters into the structure required by the API.
 *
 * @param createPlatformEndpointRequestParams - The input parameters for creating a platform endpoint.
 * @returns An object containing the request payload for the API.
 */
function createRequestData(
  createPlatformEndpointRequestParams: CreatePlatformEndpointRequest
): Record<string, any> {
  return {
    platform: createPlatformEndpointRequestParams.platform,
    mobile_device_token: createPlatformEndpointRequestParams.deviceToken,
    ...(createPlatformEndpointRequestParams.type && {
      platform_type: createPlatformEndpointRequestParams.type,
    }),
  };
}
