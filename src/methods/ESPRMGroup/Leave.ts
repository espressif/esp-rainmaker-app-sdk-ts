/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMGroup } from "../../ESPRMGroup";
import { ESPRMAPIManager } from "../../services/ESPRMAPIManager";
import { ESPAPIResponse } from "../../types/output";
import { APIEndpoints, HTTPMethods } from "../../utils/constants";

/**
 * Augments the ESPRMGroup class with the `leave` method.
 */
declare module "../../ESPRMGroup" {
  interface ESPRMGroup {
    /**
     * Removes the user from the current group.
     *
     * This method sends a DELETE request to the API to remove the user's association
     * with the current group, effectively allowing the user to leave the group.
     *
     * @returns {Promise<ESPAPIResponse>} A promise that resolves to the API success response.
     */
    leave(): Promise<ESPAPIResponse>;
  }
}

/**
 * Implementation of the `leave` method for the `ESPRMGroup` class.
 *
 * This method sends a DELETE request to the API to remove the user's association with
 * the current group. The group ID is taken from the instance of `ESPRMGroup`.
 *
 * @returns {Promise<ESPAPIResponse>} A promise that resolves with the success response from the API.
 */
ESPRMGroup.prototype.leave = async function (): Promise<ESPAPIResponse> {
  const requestParams = {
    group_id: this.id,
    leave: true,
  };

  const requestConfig = {
    url: APIEndpoints.USER_GROUP,
    method: HTTPMethods.DELETE,
    params: requestParams,
  };

  const response = await ESPRMAPIManager.authorizeRequest(requestConfig);
  return response as ESPAPIResponse;
};
