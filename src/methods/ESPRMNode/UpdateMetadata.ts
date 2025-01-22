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
 * Augments the `ESPRMNode` class with the `updateMetadata` method,
 * allowing users to update the metadata associated with a specific node.
 */
declare module "../../ESPRMNode" {
  interface ESPRMNode {
    updateMetadata(metadata: Record<string, any>): Promise<ESPAPIResponse>;
  }
}

/**
 * Updates the metadata for the current node.
 *
 * @param metadata - An object containing the metadata to be updated.
 * @returns A promise that resolves to the response indicating the success of the operation.
 */
ESPRMNode.prototype.updateMetadata = async function (
  metadata: Record<string, any>
): Promise<ESPAPIResponse> {
  const requestParams = {
    node_id: this.id,
  };

  const requestBody = {
    metadata,
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
