/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMNode } from "../../ESPRMNode";
import { ESPRMAPIManager } from "../../services/ESPRMAPIManager";
import { NodePayload } from "../../types/input";
import { ESPAPIResponse } from "../../types/output";
import { APIEndpoints, HTTPMethods } from "../../utils/constants";

declare module "../../ESPRMNode" {
  interface ESPRMNode {
    /**
     * Sets multiple parameters for the node.
     *
     * @param payload - The payload containing the parameters to be set.
     * @returns A promise that resolves to the API response.
     */
    setMultipleParams(payload: NodePayload): Promise<ESPAPIResponse>;
  }
}

/**
 * Sets multiple parameters for the node.
 *
 * @param payload - The payload containing the parameters to be set.
 * @returns A promise that resolves to the API response.
 */
ESPRMNode.prototype.setMultipleParams = async function (
  payload: NodePayload
): Promise<ESPAPIResponse> {
  const requestData = createRequestData(payload, this.id);

  const requestConfig = {
    url: APIEndpoints.USER_NODE_PARAM,
    method: HTTPMethods.PUT,
    data: [requestData],
  };

  const response = await ESPRMAPIManager.authorizeRequest(requestConfig);
  return response as ESPAPIResponse;
};

/**
 * Creates the request data for setting multiple parameters.
 *
 * @param nodePayload - The payload containing the parameters to be set.
 * @param nodeId - The ID of the node.
 * @returns The request data object.
 */
function createRequestData(nodePayload: NodePayload, nodeId: string) {
  const payload: Record<string, any> = {};
  for (const key in nodePayload) {
    const updatedParamsValueArray = nodePayload[key];
    payload[key] = updatedParamsValueArray.reduce((acc, curr) => {
      return { ...acc, ...curr };
    }, {});
  }

  return {
    node_id: nodeId,
    payload,
  };
}
