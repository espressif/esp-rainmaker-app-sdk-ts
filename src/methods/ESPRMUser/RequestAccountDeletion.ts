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
 * Augments the ESPRMUser class with the `requestAccountDeletion` method.
 */
declare module "../../ESPRMUser" {
  interface ESPRMUser {
    /**
     * Sends a request to initiate the account deletion process.
     *
     * @returns A promise that resolves to an `ESPAPIResponse` indicating the success of the account deletion request.
     */
    requestAccountDeletion(): Promise<ESPAPIResponse>;
  }
}

/**
 * Initiates the account deletion process by sending a request.
 *
 * @returns A promise that resolves to an `ESPAPIResponse` indicating the success of the account deletion request.
 */
ESPRMUser.prototype.requestAccountDeletion =
  async function (): Promise<ESPAPIResponse> {
    const requestData = {
      request: true,
    };

    const requestConfig = {
      url: APIEndpoints.USER,
      method: HTTPMethods.DELETE,
      params: requestData,
    };

    const response = await ESPRMAPIManager.authorizeRequest(requestConfig);
    return response as ESPAPIResponse;
  };
