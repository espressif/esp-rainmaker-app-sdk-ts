/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMGroup } from "../../ESPRMGroup";
import { ESPRMAPIManager } from "../../services/ESPRMAPIManager";
import { ESPAPIResponse } from "../../types/output";
import {
  APICallValidationErrorCodes,
  APIEndpoints,
  APIOperations,
  HTTPMethods,
} from "../../utils/constants";
import { ESPAPICallValidationError } from "../../utils/error/Error";

/**
 * Augments the ESPRMGroup class with the `addNodes` method to add nodes to the group.
 */
declare module "../../ESPRMGroup" {
  interface ESPRMGroup {
    /**
     * Adds a list of nodes to the current group.
     *
     * @param {string[]} nodeList - The list of node IDs to add to the group.
     * @returns {Promise<ESPAPIResponse>} A promise that resolves to the API success response.
     * @throws {ESPAPICallValidationError} If the `nodeList` is empty.
     */
    addNodes(nodeList: string[]): Promise<ESPAPIResponse>;
  }
}

/**
 * Implementation of the `addNodes` method for the `ESPRMGroup` class.
 *
 * This method sends a PUT request to the API to add nodes to a group. The group ID
 * is taken from the instance of `ESPRMGroup`, and the node list is passed as input.
 *
 * @param {string[]} nodeList - The array of node IDs to add to the group.
 * @returns {Promise<ESPAPIResponse>} A promise that resolves with the success response from the API.
 * @throws {ESPAPICallValidationError} If the nodeList is empty, an error with code `MISSING_NODE_LIST` is thrown.
 */
ESPRMGroup.prototype.addNodes = async function (
  nodeList: string[]
): Promise<ESPAPIResponse> {
  if (nodeList.length === 0) {
    throw new ESPAPICallValidationError(
      APICallValidationErrorCodes.MISSING_NODE_LIST
    );
  }

  const requestData = {
    operation: APIOperations.ADD,
    nodes: nodeList,
  };

  const requestParams = {
    group_id: this.id,
  };

  const requestConfig = {
    url: APIEndpoints.USER_GROUP,
    method: HTTPMethods.PUT,
    data: requestData,
    params: requestParams,
  };

  const response = await ESPRMAPIManager.authorizeRequest(requestConfig);
  return response as ESPAPIResponse;
};
