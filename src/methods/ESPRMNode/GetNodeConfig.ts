/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMNode } from "../../ESPRMNode";
import { ESPRMNodeConfig } from "../../ESPRMNodeConfig";
import { ESPRMAPIManager } from "../../services/ESPRMAPIManager";
import { transformNodeConfig } from "../../services/ESPRMHelpers/TransformNodesResponse";
import { APIEndpoints, HTTPMethods } from "../../utils/constants";

/**
 * Augments the `ESPRMNode` class with the `getNodeConfig` method to fetch the
 * configuration details of the node.
 */
declare module "../../ESPRMNode" {
  interface ESPRMNode {
    getNodeConfig(): Promise<ESPRMNodeConfig>;
  }
}

/**
 * Fetches the configuration details for the node.
 *
 * @returns A promise that resolves to an `ESPRMNodeConfig` instance containing the
 * node configuration details.
 */
ESPRMNode.prototype.getNodeConfig =
  async function (): Promise<ESPRMNodeConfig> {
    const requestParams = {
      node_id: this.id,
    };

    const requestConfig = {
      url: APIEndpoints.USER_NODE_CONFIG,
      method: HTTPMethods.GET,
      params: requestParams,
    };

    const response = await ESPRMAPIManager.authorizeRequest(requestConfig);
    const transformedNodeConfigResponse = transformNodeConfig(response);
    return new ESPRMNodeConfig(transformedNodeConfigResponse!, this);
  };
