/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMNode } from "../../ESPRMNode";
import { ESPRMAPIManager } from "../../services/ESPRMAPIManager";
import { ESPAPIResponse } from "../../types/output";
import { APIEndpoints, HTTPMethods } from "../../utils/constants";

/**
 * Augments the `ESPRMNode` class with the `removeSharingFor` method to facilitate
 * removal of node sharing requests for a specified user.
 */
declare module "../../ESPRMNode" {
  interface ESPRMNode {
    /**
     * Remove sharing of the current node for a specified user.
     *
     * @param username - The username of the user for whom the sharing is to be removed.
     * @returns A promise that resolves to a success response upon successful removal.
     */
    removeSharingFor(username: string): Promise<ESPAPIResponse>;
  }
}

/**
 * Remove sharing of the current node for a specified user.
 *
 * @param username - The username of the user for whom the sharing of the current node is to be removed.
 * @returns A promise that resolves to a success response upon successful removal.
 */
ESPRMNode.prototype.removeSharingFor = async function (
  username: string
): Promise<ESPAPIResponse> {
  const requestParams = {
    nodes: this.id,
    user_name: username,
  };

  const requestConfig = {
    url: APIEndpoints.USER_NODE_SHARING,
    method: HTTPMethods.DELETE,
    params: requestParams,
  };

  const response = await ESPRMAPIManager.authorizeRequest(requestConfig);
  return response as ESPAPIResponse;
};
