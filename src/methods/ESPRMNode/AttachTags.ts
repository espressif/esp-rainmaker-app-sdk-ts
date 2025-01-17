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
 * Augments the ESPRMNode class with the `attachTags` method.
 */
declare module "../../ESPRMNode" {
  interface ESPRMNode {
    /**
     * Attaches tags to the node.
     *
     * @param tags - An array of tags to attach to the node.
     * @returns A promise that resolves to the API response.
     */
    attachTags(tags: string[]): Promise<ESPAPIResponse>;
  }
}

/**
 * Attaches tags to the node.
 *
 * @param tags - An array of tags to attach to the node.
 * @returns A promise that resolves to the API response.
 */
ESPRMNode.prototype.attachTags = async function (
  tags: string[]
): Promise<ESPAPIResponse> {
  const requestParams = {
    node_id: this.id,
  };

  const requestBody = {
    tags,
  };

  const requestConfig = {
    url: APIEndpoints.USER_NODE,
    method: HTTPMethods.PUT,
    data: requestBody,
    params: requestParams,
  };

  const response = await ESPRMAPIManager.authorizeRequest(requestConfig);
  return response as ESPAPIResponse;
};
