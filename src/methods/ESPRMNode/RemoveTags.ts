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
 * Augments the `ESPRMNode` class with the `removeTags` method, allowing
 * the removal of tags from a specific node.
 */
declare module "../../ESPRMNode" {
  interface ESPRMNode {
    removeTags(): Promise<ESPAPIResponse>;
  }
}

/**
 * Removes tags from the current node.
 *
 * @returns A promise that resolves to the response indicating the success of the operation.
 */
ESPRMNode.prototype.removeTags = async function (): Promise<ESPAPIResponse> {
  const requestParams = {
    node_id: this.id,
  };

  const requestBody = {
    tags: this.tags,
  };

  const requestConfig = {
    url: APIEndpoints.USER_NODE,
    method: HTTPMethods.DELETE,
    data: requestBody,
    params: requestParams,
  };

  const response = await ESPRMAPIManager.authorizeRequest(requestConfig);
  return response as ESPAPIResponse;
};
