/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMUser } from "../../ESPRMUser";
import { ESPRMAPIManager } from "../../services/ESPRMAPIManager";
import { ESPAPIResponse } from "../../types/output";
import {
  APIEndpoints,
  APIOperations,
  HTTPMethods,
} from "../../utils/constants";

/**
 * Augments the ESPRMUser class with the `removeTags` method.
 */
declare module "../../ESPRMUser" {
  interface ESPRMUser {
    /**
     * Removes tags to the current user.
     *
     * This method sends a request to remove the provided tags with the currently logged-in user.
     *
     * @param tags - An array of strings representing the tags to be removed.
     * @returns A promise that resolves to an `ESPAPIResponse` containing the result of the operation.
     */
    removeTags(tags: string[]): Promise<ESPAPIResponse>;
  }
}

/**
 * Removes tags to the current user.
 *
 * This method sends a request to remove the provided tags with the currently logged-in user.
 *
 * @param tags - An array of strings representing the tags to be removed.
 * @returns A promise that resolves to an `ESPAPIResponse` containing the result of the operation.
 */
ESPRMUser.prototype.removeTags = async function (
  tags: string[]
): Promise<ESPAPIResponse> {
  const requestData = {
    operation: APIOperations.REMOVE,
    tags,
  };

  const requestConfig = {
    url: APIEndpoints.USER,
    method: HTTPMethods.PUT,
    data: requestData,
  };

  const response = await ESPRMAPIManager.authorizeRequest(requestConfig);
  return response as ESPAPIResponse;
};
