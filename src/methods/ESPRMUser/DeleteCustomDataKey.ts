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
 * Augments the ESPRMUser class with the `deleteCustomDataKey` method.
 */
declare module "../../ESPRMUser" {
  interface ESPRMUser {
    /**
     * Deletes the custom data entry associated with the specified key for the current user.
     * This method sends a request to delete the custom data entry for the specified key associated with the currently logged-in user.
     * @param name The key of the custom data entry to be deleted.
     * @returns A promise that resolves to an ESPAPIResponse indicating the success or failure of the operation.
     */
    deleteCustomDataKey(name: string): Promise<ESPAPIResponse>;
  }
}

ESPRMUser.prototype.deleteCustomDataKey = async function (
  name: string
): Promise<ESPAPIResponse> {
  const requestData: UserCustomDataRequest = {
    [name]: null,
  };
  const requestConfig = {
    url: APIEndpoints.USER_CUSTOM_DATA,
    method: HTTPMethods.PUT,
    data: requestData,
  };

  await ESPRMAPIManager.authorizeRequest(requestConfig);
  const successResponse: ESPAPIResponse = {
    status: StatusMessage.SUCCESS,
    description: `Custom data entry with key '${name}' deleted successfully.`,
  };
  return successResponse;
};
