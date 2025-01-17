/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMNode } from "../../ESPRMNode";
import { ESPRMUser } from "../../ESPRMUser";
import { ESPRMAPIManager } from "../../services/ESPRMAPIManager";
import { transformNodesResponse } from "../../services/ESPRMHelpers/TransformNodesResponse";
import { GetUserNodesRequestParams } from "../../types/input";
import { ESPRMNodeInterface } from "../../types/node";
import {
  GetNodesAPIResponse,
  ESPPaginatedNodesResponse,
} from "../../types/output";
import { APIEndpoints, HTTPMethods } from "../../utils/constants";

/**
 * Augments the `ESPRMUser` class with the `getUserNodesWith` method to fetch user nodes
 * with optional pagination.
 */
declare module "../../ESPRMUser" {
  interface ESPRMUser {
    /**
     * Retrieves user nodes based on the provided request parameters.
     *
     * @param getUserNodesWithRequestParams - The parameters for the request to get user nodes.
     * @returns A promise that resolves to a paginated response containing the user nodes.
     */
    getUserNodesWith(
      getUserNodesWithRequestParams: GetUserNodesRequestParams
    ): Promise<ESPPaginatedNodesResponse>;
  }
}

/**
 * Fetches user nodes with optional pagination.
 *
 * @param getUserNodesWithRequestParams - Parameters to filter the user nodes.
 * @returns A promise that resolves to a paginated response containing the user nodes.
 */
ESPRMUser.prototype.getUserNodesWith = async function (
  getUserNodesWithRequestParams: GetUserNodesRequestParams
): Promise<ESPPaginatedNodesResponse> {
  let nextId: string | null = null;

  // Function to fetch nodes (both initial and paginated requests)
  const fetchNodes = async (
    nextIdParam?: string
  ): Promise<ESPPaginatedNodesResponse> => {
    const requestData = createRequestData(
      getUserNodesWithRequestParams,
      nextIdParam
    );

    const requestConfig = {
      url: APIEndpoints.USER_NODE,
      method: HTTPMethods.GET,
      params: requestData,
    };

    const response: GetNodesAPIResponse =
      await ESPRMAPIManager.authorizeRequest(requestConfig);

    const list: ESPRMNodeInterface[] = transformNodesResponse(
      response,
      getUserNodesWithRequestParams.nodeDetails
    );

    const nodesList: ESPRMNode[] = list.map(
      (nodeDetail) => new ESPRMNode(nodeDetail)
    );

    nextId = response.next_id || null;

    const responseData: ESPPaginatedNodesResponse = {
      nodes: nodesList,
      hasNext: !!nextId,
    };

    if (nextId) {
      responseData.fetchNext = async () => {
        return fetchNodes(nextId ?? undefined);
      };
    }

    return responseData;
  };

  return fetchNodes();
};

/**
 * Creates request data for fetching user nodes based on specified parameters.
 *
 * @param getUserNodesWithRequestParams - The parameters for fetching nodes.
 * @param nextIdParam - The ID for the next set of nodes, if applicable.
 * @returns An object representing the request data.
 */
function createRequestData(
  getUserNodesWithRequestParams: GetUserNodesRequestParams,
  nextIdParam?: string
): Record<string, any> {
  return {
    ...(getUserNodesWithRequestParams.nodeDetails !== undefined && {
      node_details: getUserNodesWithRequestParams.nodeDetails,
    }),
    ...(getUserNodesWithRequestParams.nodeConfig !== undefined && {
      config: getUserNodesWithRequestParams.nodeConfig,
    }),
    ...(getUserNodesWithRequestParams.connectivityStatus !== undefined && {
      status: getUserNodesWithRequestParams.connectivityStatus,
    }),
    ...(getUserNodesWithRequestParams.parameters !== undefined && {
      params: getUserNodesWithRequestParams.parameters,
    }),
    ...(getUserNodesWithRequestParams.tags !== undefined && {
      tags: getUserNodesWithRequestParams.tags,
    }),
    ...(getUserNodesWithRequestParams.showTags !== undefined && {
      show_tags: getUserNodesWithRequestParams.showTags,
    }),
    ...(getUserNodesWithRequestParams.resultCount !== undefined && {
      num_records: getUserNodesWithRequestParams.resultCount,
    }),
    ...(nextIdParam !== undefined && { start_id: nextIdParam }),
  };
}
