/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMAuth } from "../../ESPRMAuth";
import { ESPRMAPIManager } from "../../services/ESPRMAPIManager";

import { SignUpRequest } from "../../types/input";
import { ESPAPIResponse } from "../../types/output";
import { APIEndpoints, HTTPMethods } from "../../utils/constants";

/**
 * Augments the ESPRMAuth class with the `sendSignUpCode` method.
 */
declare module "../../ESPRMAuth" {
  interface ESPRMAuth {
    /**
     * Registers a new user by providing their username and password.
     *
     * @param username - The username for the new account.
     * @param password - The password for the new account.
     * @returns A promise that resolves to an `ESPAPIResponse` indicating the success in sending sign up code.
     */
    sendSignUpCode(username: string, password: string): Promise<ESPAPIResponse>;
  }
}

/**
 * Sends a request to register a new user with the provided username and password.
 *
 * @param username - The username to register for the new user.
 * @param password - The password to set for the new user account.
 * @returns A promise that resolves to an `ESPAPIResponse` indicating the success in sending sign up code.
 */
ESPRMAuth.prototype.sendSignUpCode = async function (
  username: string,
  password: string
): Promise<ESPAPIResponse> {
  const requestData: SignUpRequest = {
    user_name: username,
    password,
  };

  const requestConfig = {
    url: APIEndpoints.USER,
    method: HTTPMethods.POST,
    data: requestData,
  };

  const response = await ESPRMAPIManager.request(requestConfig);
  return response as ESPAPIResponse;
};
