/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMNode } from "../../ESPRMNode";
import { ESPRMAPIManager } from "../../services/ESPRMAPIManager";
import { ESPAPIResponse } from "../../types/output";
import {
  APIEndpoints,
  APIOperations,
  HTTPMethods,
} from "../../utils/constants";

/**
 * Augments the ESPRMNode class with the `delete` method.
 */
declare module "../../ESPRMNode" {
  interface ESPRMNode {
    /**
     * Deletes the mapping of current node with user.
     *
     * @returns {Promise<ESPAPIResponse>} A promise that resolves to the API success response.
     */
    delete(): Promise<ESPAPIResponse>;
  }
}

/**
 * Implementation of the `delete` method for the `ESPRMNode` class.
 *
 * This method sends a PUT request to the API to delete the mapping of the current node with the current user. The node ID
 * is taken from the instance of `ESPRMNode`.
 *
 * @returns {Promise<ESPAPIResponse>} A promise that resolves with the success response from the API.
 */
ESPRMNode.prototype.delete = async function (): Promise<ESPAPIResponse> {
  const requestData = {
    node_id: this.id,
    operation: APIOperations.REMOVE,
  };

  const requestConfig = {
    url: APIEndpoints.USER_NODE_MAP,
    method: HTTPMethods.PUT,
    data: requestData,
  };
  const response = await ESPRMAPIManager.authorizeRequest(requestConfig);
  return response as ESPAPIResponse;
};
