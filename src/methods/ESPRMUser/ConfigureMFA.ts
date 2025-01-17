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
 * Augments the ESPRMUser class with the `configureMFA` method.
 */
declare module "../../ESPRMUser" {
  interface ESPRMUser {
    /**
     * Enables or disables multi-factor authentication (MFA) for the current user.
     *
     * @param enabled - A boolean indicating whether MFA should be enabled (`true`) or not (`false`).
     * @returns A promise that resolves to an `ESPAPIResponse` object containing the result of the operation.
     */
    configureMFA(enabled: boolean): Promise<ESPAPIResponse>;
  }
}

/**
 * Enables or disables multi-factor authentication (MFA) for the current user.
 *
 * @param enabled - A boolean indicating whether MFA should be enabled (`true`) or disabled (`false`).
 * @returns A promise that resolves to an `ESPAPIResponse` object containing the result of the operation.
 */
ESPRMUser.prototype.configureMFA = async function (
  enabled: boolean
): Promise<ESPAPIResponse> {
  const requestData = {
    mfa: enabled,
  };

  const requestConfig = {
    url: APIEndpoints.USER,
    method: HTTPMethods.PUT,
    data: requestData,
  };

  const response = await ESPRMAPIManager.authorizeRequest(requestConfig);
  return response as ESPAPIResponse;
};
