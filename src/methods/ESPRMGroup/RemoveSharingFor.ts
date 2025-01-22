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
 * Augments the ESPRMGroup class with the `removeSharingFor` method.
 */
declare module "../../ESPRMGroup" {
  interface ESPRMGroup {
    /**
     * Removes sharing permissions for a specified user in the current group.
     *
     * @param {string} username - The username of the user for whom sharing permissions will be removed.
     * @returns {Promise<ESPAPIResponse>} A promise that resolves to the API success response.
     */
    removeSharingFor(username: string): Promise<ESPAPIResponse>;
  }
}

/**
 * Implementation of the `removeSharingFor` method for the `ESPRMGroup` class.
 *
 * This method sends a DELETE request to the API to remove sharing permissions for the specified user
 * in the current group. The group ID is taken from the instance of `ESPRMGroup`.
 *
 * @param {string} username - The username of the user for whom sharing permissions will be removed.
 * @returns {Promise<ESPAPIResponse>} A promise that resolves with the success response from the API.
 */
ESPRMGroup.prototype.removeSharingFor = async function (
  username: string
): Promise<ESPAPIResponse> {
  const requestParams = {
    group_id: this.id,
    remove_sharing: true,
    user_name: username,
  };

  const requestConfig = {
    url: APIEndpoints.USER_GROUP,
    method: HTTPMethods.DELETE,
    params: requestParams,
  };

  const response = await ESPRMAPIManager.authorizeRequest(requestConfig);
  return response as ESPAPIResponse;
};
