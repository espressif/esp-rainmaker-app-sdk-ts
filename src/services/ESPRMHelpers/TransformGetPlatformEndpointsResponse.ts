/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPPlatformEndpointInterface } from "../../types/ESPModules";

/**
 * Transforms the raw response data from the API into an array of
 * `ESPPlatformEndpointInterface` objects.
 *
 * This function maps the API response fields to the structure defined in
 * `ESPPlatformEndpointInterface`.
 *
 * @param data - An array of raw platform endpoint objects from the API response.
 * @returns An array of `ESPPlatformEndpointInterface` objects with the transformed data.
 */
const transformGetPlatformEndpointsResponse = (
  data: Record<string, any>[]
): ESPPlatformEndpointInterface[] => {
  const transformedGetPlatformEndpointsResponse: ESPPlatformEndpointInterface[] =
    data.map((platformData): ESPPlatformEndpointInterface => {
      return {
        deviceToken: platformData.mobile_device_token,
        endpoint: platformData.platform_endpoint_arn,
        applicationARN: platformData.platform_application_arn,
        platform: platformData.platform,
      };
    });
  return transformedGetPlatformEndpointsResponse;
};

export { transformGetPlatformEndpointsResponse };
