/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMAuth } from "../../ESPRMAuth";
import { ESPRMAPIManager } from "../../services/ESPRMAPIManager";

import { ConfirmUserRequest } from "../../types/input";
import { ESPAPIResponse } from "../../types/output";
import { APIEndpoints, HTTPMethods } from "../../utils/constants";

/**
 * Augments the ESPRMAuth class with the `confirmSignUp` method.
 */
declare module "../../ESPRMAuth" {
  interface ESPRMAuth {
    /**
     * Confirms a user’s account by verifying the username and confirmation code.
     * Optionally, tags can be provided.
     *
     * @param username - The username of the user to confirm.
     * @param verificationCode - The code sent to the user for verification.
     * @param tags - Optional tags associated with the user.
     * @returns A promise that resolves with an `ESPAPIResponse` object if the user is successfully signed up.
     */
    confirmSignUp(
      username: string,
      verificationCode: string,
      tags?: string[]
    ): Promise<ESPAPIResponse>;
  }
}

/**
 * Confirms a user's account by sending their username and verification code to the API.
 * If successful, returns a response indicating the account confirmation status.
 *
 * @param username - The username of the user to confirm.
 * @param verificationCode - The verification code sent to the user.
 * @param tags - Optional tags for categorizing or associating the user.
 * @returns A promise resolving to an `ESPAPIResponse` object.
 */
ESPRMAuth.prototype.confirmSignUp = async function (
  username: string,
  verificationCode: string,
  tags?: string[]
): Promise<ESPAPIResponse> {
  const requestData: ConfirmUserRequest = {
    user_name: username,
    verification_code: verificationCode,
    ...(tags !== undefined && { tags }),
  };

  const requestConfig = {
    url: APIEndpoints.USER,
    method: HTTPMethods.POST,
    data: requestData,
  };

  const response = await ESPRMAPIManager.request(requestConfig);
  return response as ESPAPIResponse;
};
