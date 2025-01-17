/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMUser } from "../../ESPRMUser";
import { ESPRMAPIManager } from "../../services/ESPRMAPIManager";
import { ESPAPIResponse } from "../../types/output";
import {
  APICallValidationErrorCodes,
  APIEndpoints,
  HTTPMethods,
} from "../../utils/constants";
import { ESPAPICallValidationError } from "../../utils/error/Error";

/**
 * Augments the `ESPRMUser` class with the `deleteEndpoint` method,
 * enabling the removal of a registered platform endpoint for push notifications.
 */
declare module "../../ESPRMUser" {
  interface ESPRMUser {
    /**
     * Deletes a platform endpoint associated with the specified device token or endpoint.
     *
     * @param deviceToken - The mobile device token used for identifying the platform endpoint.
     * @param endpoint - The unique endpoint identifier to delete.
     * @throws ESPAPICallValidationError - Throws an error if both `deviceToken` and `endpoint` are missing.
     * @returns A promise resolving to the API response, indicating success or failure.
     */
    deleteEndpoint(
      deviceToken?: string,
      endpoint?: string
    ): Promise<ESPAPIResponse>;
  }
}

/**
 * Adds the `deleteEndpoint` method to the `ESPRMUser` prototype.
 *
 * This method validates input parameters, constructs the request payload,
 * and invokes the API to delete a registered platform endpoint.
 *
 * @param deviceToken - The mobile device token associated with the platform endpoint (optional).
 * @param endpoint - The unique endpoint identifier to be deleted (optional).
 * @throws ESPAPICallValidationError - Throws an error if both `deviceToken` and `endpoint` are not provided.
 * @returns A promise resolving to an `ESPAPIResponse` containing the response from the API.
 */
ESPRMUser.prototype.deleteEndpoint = async function (
  deviceToken?: string,
  endpoint?: string
): Promise<ESPAPIResponse> {
  if (deviceToken === undefined || endpoint === undefined) {
    throw new ESPAPICallValidationError(
      APICallValidationErrorCodes.MISSING_DELETE_ENDPOINT_PARAMS
    );
  }
  const requestData = {
    ...(deviceToken !== undefined && {
      mobile_device_token: deviceToken,
    }),
    ...(endpoint !== undefined && {
      endpoint,
    }),
  };

  const requestConfig = {
    url: APIEndpoints.USER_PUSH_NOTIFICATION_MOBILE_PLATFORM_ENDPOINT,
    method: HTTPMethods.DELETE,
    params: requestData,
  };

  const response = await ESPRMAPIManager.authorizeRequest(requestConfig);
  return response as ESPAPIResponse;
};
