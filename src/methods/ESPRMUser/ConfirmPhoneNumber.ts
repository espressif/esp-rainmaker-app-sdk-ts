/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMUser } from "../../ESPRMUser";
import { ESPRMAPIManager } from "../../services/ESPRMAPIManager";

import { ESPAPIResponse } from "../../types/output";
import { APIEndpoints, HTTPMethods } from "../../utils/constants";

/**
 * Augments the ESPRMUser class with the `confirmPhoneNumber` method.
 */
declare module "../../ESPRMUser" {
  interface ESPRMUser {
    /**
     * Confirms the phone number associated with the user by providing a verification code.
     *
     * @param verificationCode - The verification code sent to the user for confirming the phone number.
     * @returns A promise that resolves to an `ESPAPIResponse` indicating the success of the phone number confirmation.
     */
    confirmPhoneNumber(verificationCode: string): Promise<ESPAPIResponse>;
  }
}

/**
 * Confirms the phone number associated with the user by sending the verification code.
 *
 * @param verificationCode - The verification code for confirming the phone number.
 * @returns A promise that resolves to an `ESPAPIResponse` indicating the success of the phone number confirmation.
 */
ESPRMUser.prototype.confirmPhoneNumber = async function (
  verificationCode: string
): Promise<ESPAPIResponse> {
  const requestData = {
    verification_code: verificationCode,
  };

  const requestConfig = {
    url: APIEndpoints.USER,
    method: HTTPMethods.PUT,
    data: requestData,
  };

  const response = await ESPRMAPIManager.authorizeRequest(requestConfig);
  return response as ESPAPIResponse;
};
