/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMGroup } from "../../ESPRMGroup";
import { ESPRMUser } from "../../ESPRMUser";
import { ESPRMAPIManager } from "../../services/ESPRMAPIManager";
import { transformGroupsResponse } from "../../services/ESPRMHelpers/TransformGroupsResponse";
import { ESPRMGroupInterface, GetGroupsRequestParams } from "../../types/input";
import {
  ESPPaginatedGroupsResponse,
  GetGroupsAPIResponse,
} from "../../types/output";
import { APIEndpoints, HTTPMethods } from "../../utils/constants";

/**
 * Augments the ESPRMUser class with the `getGroups` method to retrieve groups with optional pagination.
 */
declare module "../../ESPRMUser" {
  interface ESPRMUser {
    /**
     * Retrieves a list of groups with optional filters and pagination.
     * @param getGroupsRequestParams - Parameters to filter and paginate the group data.
     * @returns A promise that resolves to a paginated response containing group data.
     */
    getGroups(
      getGroupsRequestParams: GetGroupsRequestParams
    ): Promise<ESPPaginatedGroupsResponse>;
  }
}

/**
 * Retrieves groups based on the provided request parameters and supports pagination.
 *
 * @param getGroupsRequestParams - Parameters for filtering and retrieving group data.
 * @returns A promise that resolves to a paginated response containing the retrieved groups.
 */
ESPRMUser.prototype.getGroups = async function (
  getGroupsRequestParams: GetGroupsRequestParams
): Promise<ESPPaginatedGroupsResponse> {
  let nextId: string | null = null;

  const fetchGroups = async (
    nextIdParam?: string
  ): Promise<ESPPaginatedGroupsResponse> => {
    const requestData = createRequestData(getGroupsRequestParams, nextIdParam);

    const requestConfig = {
      url: APIEndpoints.USER_GROUP,
      method: HTTPMethods.GET,
      params: requestData,
    };

    const response: GetGroupsAPIResponse =
      await ESPRMAPIManager.authorizeRequest(requestConfig);

    const list: ESPRMGroupInterface[] = transformGroupsResponse(
      response.groups
    );

    const groupsList: ESPRMGroup[] = list.map(
      (nodeDetail) => new ESPRMGroup(nodeDetail)
    );

    nextId = response.next_id || null;

    const responseData: ESPPaginatedGroupsResponse = {
      groups: groupsList,
      hasNext: !!nextId,
    };

    if (nextId) {
      responseData.fetchNext = async () => {
        return fetchGroups(nextId ?? undefined);
      };
    }

    return responseData;
  };

  return fetchGroups();
};

/**
 * Creates the request data for retrieving groups.
 *
 * @param getGroupsRequestParams - Parameters for filtering the group data.
 * @param nextIdParam - The ID for the next set of paginated results.
 * @returns A record representing the formatted request payload for retrieving groups.
 */
function createRequestData(
  getGroupsRequestParams: GetGroupsRequestParams,
  nextIdParam?: string
): Record<string, any> {
  return {
    ...(getGroupsRequestParams.withNodeList !== undefined && {
      node_list: getGroupsRequestParams.withNodeList,
    }),
    ...(getGroupsRequestParams.withSubGroups !== undefined && {
      sub_groups: getGroupsRequestParams.withSubGroups,
    }),
    ...(getGroupsRequestParams.resultCount !== undefined && {
      num_records: getGroupsRequestParams.resultCount,
    }),
    ...(nextIdParam !== undefined && { start_id: nextIdParam }),
  };
}
