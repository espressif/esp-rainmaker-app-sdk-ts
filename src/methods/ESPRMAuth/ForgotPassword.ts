/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMAuth } from "../../ESPRMAuth";
import { ESPRMAPIManager } from "../../services/ESPRMAPIManager";

import { ESPAPIResponse } from "../../types/output";
import { APIEndpoints, HTTPMethods } from "../../utils/constants";

/**
 * Augments the ESPRMAuth class with the `forgotPassword` method.
 */
declare module "../../ESPRMAuth" {
  interface ESPRMAuth {
    /**
     * Initiates the forgot password flow for a user by sending their username to the API.
     *
     * @param username - The username of the user who wants to reset their password.
     * @returns A promise that resolves with an `ESPAPIResponse` indicating success.
     */
    forgotPassword(username: string): Promise<ESPAPIResponse>;
  }
}

/**
 * Sends a forgot password request for the provided username to the API.
 *
 * @param username - The username of the user requesting a password reset.
 * @returns A promise that resolves to an `ESPAPIResponse`, indicating that the request was successful.
 */
ESPRMAuth.prototype.forgotPassword = async function (
  username: string
): Promise<ESPAPIResponse> {
  const requestData = {
    user_name: username,
  };

  const requestConfig = {
    url: APIEndpoints.FORGOTPASSWORD,
    method: HTTPMethods.PUT,
    data: requestData,
  };

  const response = await ESPRMAPIManager.request(requestConfig);
  return response as ESPAPIResponse;
};
