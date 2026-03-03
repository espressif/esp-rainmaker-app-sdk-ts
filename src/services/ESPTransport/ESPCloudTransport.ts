/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPAPIResponse } from "../../types/output";
import { ESPTransportInterface } from "../../types/transport";
import { ESPRMNode } from "../../ESPRMNode";
import { APIEndpoints, HTTPMethods } from "../../utils/constants";
import { ESPRMAPIManager } from "../ESPRMAPIManager";

/**
 * Provides cloud-based transport mechanisms for setting and retrieving node parameters.
 */
class ESPCloudTransport implements ESPTransportInterface {
  /**
   * Sets a parameter on the node by sending a payload to the cloud service.
   *
   * @param payload - A record containing the parameter data to set on the node.
   * @param nodeRef - Optional reference to the ESPRMNode instance (not used in cloud transport).
   * @returns A promise that resolves to the response of the set operation.
   */
  async setParam(
    payload: Record<string, any>,
    _nodeRef?: ESPRMNode
  ): Promise<ESPAPIResponse> {
    const requestConfig = {
      url: APIEndpoints.USER_NODE_PARAM,
      method: HTTPMethods.PUT,
      data: [payload],
    };

    const response = await ESPRMAPIManager.authorizeRequest(requestConfig);
    return response as ESPAPIResponse;
  }

  /**
   * Retrieves parameters from the node by requesting data from the cloud service.
   *
   * @param payload - A record containing necessary data (e.g., `nodeId`) to retrieve the node parameters.
   * @param nodeRef - Optional reference to the ESPRMNode instance (not used in cloud transport).
   * @returns A promise that resolves to a record of the node parameters.
   */
  async getParams(
    payload: Record<string, any>,
    _nodeRef?: ESPRMNode
  ): Promise<Record<string, any>> {
    const requestParams = {
      node_id: payload.node_id,
    };
    const requestConfig = {
      url: APIEndpoints.USER_NODE_PARAM,
      method: HTTPMethods.GET,
      params: requestParams,
    };

    const response = await ESPRMAPIManager.authorizeRequest(requestConfig);

    return response!;
  }
}

export { ESPCloudTransport };
