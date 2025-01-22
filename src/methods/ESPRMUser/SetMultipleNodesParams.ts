/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMUser } from "../../ESPRMUser";
import { ESPRMAPIManager } from "../../services/ESPRMAPIManager";
import { MultipleNodePayload } from "../../types/input";
import { ESPAPIResponse } from "../../types/output";
import { APIEndpoints, HTTPMethods } from "../../utils/constants";

declare module "../../ESPRMUser" {
  interface ESPRMUser {
    /**
     * Sets multiple parameters for the nodes.
     *
     * @param payload - The payload containing the parameters to be set for multiple nodes.
     * @returns A promise that resolves to the API response.
     */
    setMultipleNodesParams(
      payload: MultipleNodePayload[]
    ): Promise<ESPAPIResponse>;
  }
}

/**
 * Sets multiple parameters for the nodes.
 *
 * @param payload - The payload containing the parameters to be set for multiple nodes.
 * @returns A promise that resolves to the API response.
 */
ESPRMUser.prototype.setMultipleNodesParams = async function (
  payload: MultipleNodePayload[]
): Promise<ESPAPIResponse> {
  const requestData = createRequestData(payload);

  const requestConfig = {
    url: APIEndpoints.USER_NODE_PARAM,
    method: HTTPMethods.PUT,
    data: requestData,
  };

  const response = await ESPRMAPIManager.authorizeRequest(requestConfig);
  return response as ESPAPIResponse;
};

/**
 * Creates the request data for setting multiple parameters.
 *
 * @param nodePayload - The payload containing the parameters to be set for multiple nodes.
 * @returns The request data object.
 */
function createRequestData(nodePayload: MultipleNodePayload[]) {
  const requestData = nodePayload.map((nodePayload) => {
    const payload: Record<string, any> = {};
    payload["node_id"] = nodePayload.nodeId;
    const paramPayload: Record<string, any> = {};
    for (const key in nodePayload.payload) {
      const updatedParamsValueArray = nodePayload.payload[key];
      paramPayload[key] = updatedParamsValueArray.reduce((acc, curr) => {
        return { ...acc, ...curr };
      }, {});
      payload["payload"] = { ...paramPayload };
    }
    return payload;
  });
  return requestData;
}
