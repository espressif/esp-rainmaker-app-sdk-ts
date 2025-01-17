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
 * Augments the ESPRMUser class with the `updateName` method.
 */
declare module "../../ESPRMUser" {
  interface ESPRMUser {
    /**
     * Updates the name associated with the current user.
     *
     * @param newName - The new name to be set for the user.
     * @returns A promise that resolves to an `ESPAPIResponse` object containing the result of the operation.
     */
    updateName(newName: string): Promise<ESPAPIResponse>;
  }
}

/**
 * Updates the name associated with the current user.
 *
 * @param newName - The new name to be set for the user.
 * @returns A promise that resolves to an `ESPAPIResponse` object containing the result of the operation.
 */
ESPRMUser.prototype.updateName = async function (
  newName: string
): Promise<ESPAPIResponse> {
  const requestData = {
    name: newName,
  };

  const requestConfig = {
    url: APIEndpoints.USER,
    method: HTTPMethods.PUT,
    data: requestData,
  };

  const response = await ESPRMAPIManager.authorizeRequest(requestConfig);
  return response as ESPAPIResponse;
};
