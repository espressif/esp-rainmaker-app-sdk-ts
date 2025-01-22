/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMConnectivityStatus } from "../../ESPRMConnectivityStatus";
import { ESPRMNode } from "../../ESPRMNode";
import { ESPRMAPIManager } from "../../services/ESPRMAPIManager";
import { transformNodeConnectivityStatus } from "../../services/ESPRMHelpers/TransformNodesResponse";
import { APIEndpoints, HTTPMethods } from "../../utils/constants";

/**
 * Augments the `ESPRMNode` class with the `getConnectivityStatus` method to fetch
 * the connectivity status of the node.
 */
declare module "../../ESPRMNode" {
  interface ESPRMNode {
    getConnectivityStatus(): Promise<ESPRMConnectivityStatus>;
  }
}

/**
 * Fetches the connectivity status for the node.
 *
 * @returns A promise that resolves to an `ESPRMConnectivityStatus` instance
 * containing the node's connectivity details.
 */
ESPRMNode.prototype.getConnectivityStatus =
  async function (): Promise<ESPRMConnectivityStatus> {
    const requestParams = {
      node_id: this.id,
    };

    const requestConfig = {
      url: APIEndpoints.USER_NODE_STATUS,
      method: HTTPMethods.GET,
      params: requestParams,
    };

    const response = await ESPRMAPIManager.authorizeRequest(requestConfig);
    const transformedNodeConnectivityStatus =
      transformNodeConnectivityStatus(response);
    return new ESPRMConnectivityStatus(transformedNodeConnectivityStatus!);
  };
