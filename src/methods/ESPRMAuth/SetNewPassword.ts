/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMAuth } from "../../ESPRMAuth";
import { ESPRMAPIManager } from "../../services/ESPRMAPIManager";

import { SetNewPasswordRequest } from "../../types/input";
import { ESPAPIResponse } from "../../types/output";
import { APIEndpoints, HTTPMethods } from "../../utils/constants";

/**
 * Augments the ESPRMAuth class with the `setNewPassword` method.
 */
declare module "../../ESPRMAuth" {
  interface ESPRMAuth {
    /**
     * Sets a new password for a user by providing their username, a new password, and a verification code.
     *
     * @param username - The username of the user who is setting a new password.
     * @param newPassword - The new password to be set for the user.
     * @param verificationCode - The verification code used to authorize the password change.
     * @returns A promise that resolves to an `ESPAPIResponse` indicating the success of the operation.
     */
    setNewPassword(
      username: string,
      newPassword: string,
      verificationCode: string
    ): Promise<ESPAPIResponse>;
  }
}

/**
 * Sends a request to set a new password for a user. Requires the username, new password, and a verification code.
 *
 * @param username - The username of the user for whom the password is being set.
 * @param newPassword - The new password to assign to the user.
 * @param verificationCode - The verification code to validate the password change request.
 * @returns A promise that resolves to an `ESPAPIResponse` indicating the success of the password change.
 */
ESPRMAuth.prototype.setNewPassword = async function (
  username: string,
  newPassword: string,
  verificationCode: string
): Promise<ESPAPIResponse> {
  const requestData: SetNewPasswordRequest = {
    user_name: username,
    password: newPassword,
    verification_code: verificationCode,
  };

  const requestConfig = {
    url: APIEndpoints.FORGOTPASSWORD,
    method: HTTPMethods.PUT,
    data: requestData,
  };

  const response = await ESPRMAPIManager.request(requestConfig);
  return response as ESPAPIResponse;
};
