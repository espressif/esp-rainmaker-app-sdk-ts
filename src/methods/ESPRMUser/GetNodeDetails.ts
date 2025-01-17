/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMNode } from "../../ESPRMNode";
import { ESPRMUser } from "../../ESPRMUser";
import { ESPRMAPIManager } from "../../services/ESPRMAPIManager";
import { transformNodesResponse } from "../../services/ESPRMHelpers/TransformNodesResponse";
import { ESPRMNodeInterface } from "../../types/node";
import { GetNodesAPIResponse } from "../../types/output";
import { APIEndpoints, HTTPMethods } from "../../utils/constants";

/**
 * Augments the `ESPRMUser` class with the `getNodeDetails` method to fetch details
 * of a specific node by its ID.
 */
declare module "../../ESPRMUser" {
  interface ESPRMUser {
    getNodeDetails(nodeId: string): Promise<ESPRMNode>;
  }
}

/**
 * Fetches the details of a specific user node by its ID.
 *
 * @param nodeId - The ID of the node whose details are to be fetched.
 * @returns A promise that resolves to an `ESPRMNode` instance containing the node's details.
 */
ESPRMUser.prototype.getNodeDetails = async function (
  nodeId: string
): Promise<ESPRMNode> {
  const requestData = { node_id: nodeId };

  const requestConfig = {
    url: APIEndpoints.USER_NODE,
    method: HTTPMethods.GET,
    params: requestData,
  };

  const response: GetNodesAPIResponse =
    await ESPRMAPIManager.authorizeRequest(requestConfig);

  const list: ESPRMNodeInterface[] = transformNodesResponse(response, true);
  const node: ESPRMNode = new ESPRMNode(list[0]);

  return node;
};
