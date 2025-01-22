/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMGroup } from "../../ESPRMGroup";
import { ESPRMAPIManager } from "../../services/ESPRMAPIManager";
import { APIEndpoints, HTTPMethods } from "../../utils/constants";

/**
 * Augments the ESPRMGroup class with the `getNodesList` method to retrieve a list of node IDs associated with the group.
 */
declare module "../../ESPRMGroup" {
  interface ESPRMGroup {
    /**
     * Retrieves the list of node IDs associated with the group.
     * @returns A promise that resolves to an array of node IDs.
     */
    getNodesList(): Promise<string[]>;
  }
}

/**
 * Retrieves the list of node IDs associated with the group.
 * @returns A promise that resolves to an array of node IDs.
 */
ESPRMGroup.prototype.getNodesList = async function (): Promise<string[]> {
  const requestData = {
    group_id: this.id,
    node_list: true,
  };

  const requestConfig = {
    url: APIEndpoints.USER_GROUP,
    method: HTTPMethods.GET,
    params: requestData,
  };

  const responseData = await ESPRMAPIManager.authorizeRequest(requestConfig);

  const nodes: string[] = responseData.groups[0]["nodes"];
  return nodes;
};
