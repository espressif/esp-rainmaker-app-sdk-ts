/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMUser } from "../../ESPRMUser";
import { ESPRMAPIManager } from "../../services/ESPRMAPIManager";
import { UserCustomDataRequest } from "../../types";
import { ESPAPIResponse } from "../../types/output";
import {
  APIEndpoints,
  HTTPMethods,
  StatusMessage,
} from "../../utils/constants";

/**
 * Augments the ESPRMUser class with the `setCustomData` method.
 */
declare module "../../ESPRMUser" {
  interface ESPRMUser {
    /**
     * Sets custom data associated with the current user.
     * This method sends a request to set custom data for the currently logged-in user.
     * @param data The custom data to be set for the user.
     * @returns A promise that resolves to an ESPAPIResponse indicating the success of the operation.
     */
    setCustomData(data: UserCustomDataRequest): Promise<ESPAPIResponse>;
  }
}

ESPRMUser.prototype.setCustomData = async function (
  data: UserCustomDataRequest
): Promise<ESPAPIResponse> {
  const requestConfig = {
    url: APIEndpoints.USER_CUSTOM_DATA,
    method: HTTPMethods.PUT,
    data,
  };

  await ESPRMAPIManager.authorizeRequest(requestConfig);
  const successResponse: ESPAPIResponse = {
    status: StatusMessage.SUCCESS,
    description: "Custom data has been set successfully.",
  };
  return successResponse;
};
