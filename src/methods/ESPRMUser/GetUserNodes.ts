/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMUser } from "../../ESPRMUser";
import { GetUserNodesRequestParams } from "../../types/input";
import { ESPPaginatedNodesResponse } from "../../types/output";

/**
 * Augments the `ESPRMUser` class with the `getUserNodes` method to fetch user nodes
 * with optional pagination.
 */
declare module "../../ESPRMUser" {
  interface ESPRMUser {
    /**
     * Fetches user nodes with optional pagination.
     *
     * @param resultCount - An optional parameter to specify the number of results to retrieve.
     * If not provided, all available results will be fetched.
     * @returns A promise that resolves to a paginated response containing the user nodes.
     */
    getUserNodes(resultCount?: number): Promise<ESPPaginatedNodesResponse>;
  }
}

/**
 * Fetches user nodes with detailed information and optional pagination.
 *
 * @param resultCount - An optional parameter to specify the number of results to retrieve.
 * @returns A promise that resolves to a paginated response containing the user nodes.
 */
ESPRMUser.prototype.getUserNodes = async function (
  resultCount?: number
): Promise<ESPPaginatedNodesResponse> {
  const getUserNodesWithRequestParams: GetUserNodesRequestParams = {
    nodeDetails: true,
    nodeConfig: true,
    connectivityStatus: true,
    parameters: true,
    showTags: true,
    resultCount,
  };

  const response: ESPPaginatedNodesResponse = await this.getUserNodesWith(
    getUserNodesWithRequestParams
  );

  return response;
};
