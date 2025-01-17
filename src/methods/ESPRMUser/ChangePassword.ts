/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMUser } from "../../ESPRMUser";
import { ESPRMAPIManager } from "../../services/ESPRMAPIManager";

import { ChangePasswordRequest } from "../../types/input";
import { ESPAPIResponse } from "../../types/output";
import {
  APIEndpoints,
  HTTPMethods,
  StatusMessage,
} from "../../utils/constants";

/**
 * Augments the ESPRMUser class with the `changePassword` method.
 */
declare module "../../ESPRMUser" {
  interface ESPRMUser {
    /**
     * Changes the user's password by providing their old password and a new password.
     *
     * @param oldPassword - The user's current password.
     * @param newPassword - The new password to set for the user.
     * @returns A promise that resolves to an `ESPAPIResponse` indicating the success of the password change.
     */
    changePassword(
      oldPassword: string,
      newPassword: string
    ): Promise<ESPAPIResponse>;
  }
}

/**
 * Sends a request to change the user's password. Requires the old password and the new password.
 *
 * @param oldPassword - The user's current password.
 * @param newPassword - The new password to set for the user.
 * @returns A promise that resolves to an `ESPAPIResponse` indicating the success of the password change.
 */
ESPRMUser.prototype.changePassword = async function (
  oldPassword: string,
  newPassword: string
): Promise<ESPAPIResponse> {
  const requestData: ChangePasswordRequest = {
    password: oldPassword,
    newpassword: newPassword,
  };

  const requestConfig = {
    url: APIEndpoints.PASSWORD,
    method: HTTPMethods.PUT,
    data: requestData,
  };

  const response: ESPAPIResponse =
    await ESPRMAPIManager.authorizeRequest(requestConfig);

  if (response.status === StatusMessage.SUCCESS) {
    this.cleanUpResources();
  }
  return response;
};
