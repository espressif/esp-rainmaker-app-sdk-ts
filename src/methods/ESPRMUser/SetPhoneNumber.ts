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
 * Augments the ESPRMUser class with the `setPhoneNumber` method.
 */
declare module "../../ESPRMUser" {
  interface ESPRMUser {
    /**
     * Updates the phone number associated with the current user.
     *
     * @param phoneNumber - The new phone number to be set for the user.
     * @returns A promise that resolves to an `ESPAPIResponse` object containing the result of the operation.
     */
    setPhoneNumber(phoneNumber: string): Promise<ESPAPIResponse>;
  }
}

/**
 * Updates the phone number associated with the current user.
 *
 * @param phoneNumber - The new phone number to be set for the user.
 * @returns A promise that resolves to an `ESPAPIResponse` object containing the result of the operation.
 */
ESPRMUser.prototype.setPhoneNumber = async function (
  phoneNumber: string
): Promise<ESPAPIResponse> {
  const requestData = {
    phone_number: phoneNumber,
  };

  const requestConfig = {
    url: APIEndpoints.USER,
    method: HTTPMethods.PUT,
    data: requestData,
  };

  const response = await ESPRMAPIManager.authorizeRequest(requestConfig);
  return response as ESPAPIResponse;
};
