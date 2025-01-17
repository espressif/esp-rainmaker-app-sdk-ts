/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMGroup } from "../../ESPRMGroup";
import { ESPRMNode } from "../../ESPRMNode";
import { ESPRMAPIManager } from "../../services/ESPRMAPIManager";
import { transformNodesResponse } from "../../services/ESPRMHelpers/TransformNodesResponse";
import { APIEndpoints, HTTPMethods } from "../../utils/constants";

/**
 * Augments the ESPRMGroup class with the `getNodesWithDetails` method to retrieve nodes with detailed information.
 */
declare module "../../ESPRMGroup" {
  interface ESPRMGroup {
    /**
     * Retrieves a list of nodes with detailed information.
     * @returns A promise that resolves to an array of `ESPRMNode` instances with detailed data.
     */
    getNodesWithDetails(): Promise<ESPRMNode[]>;
  }
}

/**
 * Retrieves a list of nodes with detailed information for the group.
 * @returns A promise that resolves to an array of `ESPRMNode` instances with detailed data.
 */
ESPRMGroup.prototype.getNodesWithDetails = async function (): Promise<
  ESPRMNode[]
> {
  const requestData = {
    group_id: this.id,
    node_details: true,
  };

  const requestConfig = {
    url: APIEndpoints.USER_GROUP,
    method: HTTPMethods.GET,
    params: requestData,
  };

  const responseData = await ESPRMAPIManager.authorizeRequest(requestConfig);

  const data: Record<string, any> = responseData.groups[0];
  const transformedNodes = transformNodesResponse(data, true);
  const nodesList: ESPRMNode[] = transformedNodes.map(
    (node) => new ESPRMNode(node)
  );
  return nodesList;
};
