/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPPlatformEndpoint } from "../../ESPPlatformEndpoint";
import { ESPRMUser } from "../../ESPRMUser";
import { ESPRMAPIManager } from "../../services/ESPRMAPIManager";
import { transformGetPlatformEndpointsResponse } from "../../services/ESPRMHelpers/TransformGetPlatformEndpointsResponse";
import { ESPPlatformEndpointInterface } from "../../types/ESPModules";
import { APIEndpoints, HTTPMethods } from "../../utils/constants";

/**
 * Augments the `ESPRMUser` class with the `getPlatformEndpoints` method,
 * enabling the retrieval of registered platform endpoints.
 */
declare module "../../ESPRMUser" {
  interface ESPRMUser {
    /**
     * Fetches a list of registered platform endpoints associated with the user.
     *
     * @returns A promise that resolves to an array of `ESPPlatformEndpoint` instances.
     */
    getPlatformEndpoints(): Promise<ESPPlatformEndpoint[]>;
  }
}

/**
 * Adds the `getPlatformEndpoints` method to the `ESPRMUser` prototype.
 *
 * This method sends a request to the API to fetch all registered platform endpoints.
 * These endpoints are used to receive remote notifications for the user.
 *
 * @returns A promise resolving to an array of `ESPPlatformEndpoint` instances,
 * which represent the registered endpoints.
 */
ESPRMUser.prototype.getPlatformEndpoints = async function (): Promise<
  ESPPlatformEndpoint[]
> {
  const requestConfig = {
    url: APIEndpoints.USER_PUSH_NOTIFICATION_MOBILE_PLATFORM_ENDPOINT,
    method: HTTPMethods.GET,
  };

  const response = await ESPRMAPIManager.authorizeRequest(requestConfig);
  const list: ESPPlatformEndpointInterface[] =
    transformGetPlatformEndpointsResponse(response.platform_endpoints);

  const platformEndpointsList = list.map(
    (platform) => new ESPPlatformEndpoint(platform)
  );

  return platformEndpointsList;
};
