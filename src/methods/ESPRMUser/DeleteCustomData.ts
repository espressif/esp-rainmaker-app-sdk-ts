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
 * Augments the ESPRMUser class with the `deleteCustomData` method.
 */
declare module "../../ESPRMUser" {
  interface ESPRMUser {
    /**
     * Deletes the custom data value associated with the specified key for the current user.
     * This method sends a request to delete the custom data value for the given key associated with the currently logged-in user.
     * @param forKey The key for which the custom data value is to be deleted.
     * @returns A promise that resolves to a success response upon deleting the custom data.
     */
    deleteCustomData(forKey: string): Promise<ESPAPIResponse>;
  }
}

ESPRMUser.prototype.deleteCustomData = async function (
  forKey: string
): Promise<ESPAPIResponse> {
  const requestData: UserCustomDataRequest = {
    [forKey]: {
      value: null,
    },
  };
  const requestConfig = {
    url: APIEndpoints.USER_CUSTOM_DATA,
    method: HTTPMethods.PUT,
    data: requestData,
  };

  await ESPRMAPIManager.authorizeRequest(requestConfig);
  const successResponse: ESPAPIResponse = {
    status: StatusMessage.SUCCESS,
    description: `Custom data for key '${forKey}' deleted successfully.`,
  };
  return successResponse;
};
