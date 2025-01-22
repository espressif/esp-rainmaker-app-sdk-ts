/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMUser } from "../../ESPRMUser";
import { ESPRMAPIManager } from "../../services/ESPRMAPIManager";
import { ESPRMStorage } from "../../services/ESPRMStorage/ESPRMStorage";

import { ESPAPIResponse } from "../../types/output";
import {
  APIEndpoints,
  HTTPMethods,
  StatusMessage,
} from "../../utils/constants";

/**
 * Augments the ESPRMUser class with the `confirmAccountDeletion` method.
 */
declare module "../../ESPRMUser" {
  interface ESPRMUser {
    /**
     * Confirms the account deletion request by providing a verification code.
     *
     * @param verificationCode - The verification code sent to the user for account deletion confirmation.
     * @returns A promise that resolves to an `ESPAPIResponse` indicating the success of the account deletion confirmation.
     */
    confirmAccountDeletion(verificationCode: string): Promise<ESPAPIResponse>;
  }
}

/**
 * Sends a request to confirm the account deletion using the provided verification code.
 *
 * @param verificationCode - The verification code for confirming the account deletion.
 * @returns A promise that resolves to an `ESPAPIResponse` indicating the success of the account deletion confirmation.
 */
ESPRMUser.prototype.confirmAccountDeletion = async function (
  verificationCode: string
): Promise<ESPAPIResponse> {
  const requestData = {
    verification_code: verificationCode,
  };

  const requestConfig = {
    url: APIEndpoints.USER,
    method: HTTPMethods.DELETE,
    params: requestData,
  };

  const response: ESPAPIResponse =
    await ESPRMAPIManager.authorizeRequest(requestConfig);
  if (response.status === StatusMessage.SUCCESS) {
    this.cleanUpResources();
    ESPRMStorage.clear();
  }
  return response;
};
