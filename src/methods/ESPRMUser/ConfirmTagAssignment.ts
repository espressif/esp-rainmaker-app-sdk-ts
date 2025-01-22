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
 * Augments the ESPRMUser class with the `confirmTagAssignment` method.
 */
declare module "../../ESPRMUser" {
  interface ESPRMUser {
    /**
     * Confirms the assignment of tags to the user by providing a verification code.
     *
     * @param verificationCode - The verification code for confirming the tag assignment.
     * @returns A promise that resolves to an `ESPAPIResponse` indicating the success of the tag assignment confirmation.
     */
    confirmTagAssignment(verificationCode: string): Promise<ESPAPIResponse>;
  }
}

/**
 * Confirms the assignment of tags to the user using the provided verification code.
 *
 * @param verificationCode - The verification code used to confirm the tag assignment.
 * @returns A promise that resolves to an `ESPAPIResponse` indicating the success of the tag assignment confirmation.
 */
ESPRMUser.prototype.confirmTagAssignment = async function (
  verificationCode: string
): Promise<ESPAPIResponse> {
  const requestData = {
    tags_verification_code: verificationCode,
  };

  const requestConfig = {
    url: APIEndpoints.USER,
    method: HTTPMethods.PUT,
    data: requestData,
  };

  const response = await ESPRMAPIManager.authorizeRequest(requestConfig);
  return response as ESPAPIResponse;
};
