/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMAuth } from "../../ESPRMAuth";
import { ESPRMAPIManager } from "../../services/ESPRMAPIManager";

import { RequestLoginOTPResponse } from "../../types/output";
import { APIEndpoints, HTTPMethods } from "../../utils/constants";

/**
 * Augments the ESPRMAuth class with the `requestLoginOTP` method.
 */
declare module "../../ESPRMAuth" {
  interface ESPRMAuth {
    /**
     * Requests a login OTP (One-Time Password) for the specified username.
     *
     * @param username - The username for which the OTP is requested.
     * @returns A promise that resolves to a `sessionToken` string indicating the OTP session.
     */
    requestLoginOTP(username: string): Promise<string>;
  }
}

/**
 * Sends a request to obtain a login OTP (One-Time Password) for the specified username.
 *
 * @param username - The username for which the OTP is requested.
 * @returns A promise that resolves to a `sessionToken` string, which is part of the OTP response.
 */
ESPRMAuth.prototype.requestLoginOTP = async function (
  username: string
): Promise<string> {
  const requestData = {
    user_name: username,
  };

  const requestConfig = {
    url: APIEndpoints.LOGIN,
    method: HTTPMethods.POST,
    data: requestData,
  };

  const response = await ESPRMAPIManager.request(requestConfig);
  const responseData: RequestLoginOTPResponse = response;
  return responseData.session;
};
