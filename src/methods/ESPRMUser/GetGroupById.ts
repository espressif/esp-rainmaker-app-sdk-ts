/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMGroup } from "../../ESPRMGroup";
import { ESPRMUser } from "../../ESPRMUser";
import { ESPRMAPIManager } from "../../services/ESPRMAPIManager";
import { transformGroupsResponse } from "../../services/ESPRMHelpers/TransformGroupsResponse";
import { GetGroupByIdRequestParams } from "../../types/input";
import {
  APICallValidationErrorCodes,
  APIEndpoints,
  HTTPMethods,
} from "../../utils/constants";
import { ESPAPICallValidationError } from "../../utils/error/Error";

/**
 * Augments the ESPRMUser class with the `getGroupById` method to retrieve a group by its ID.
 */
declare module "../../ESPRMUser" {
  interface ESPRMUser {
    /**
     * Retrieves a group by its ID.
     * @param getGroupByIdRequestParams - Parameters to filter the group data by ID.
     * @returns A promise that resolves to an instance of `ESPRMGroup`.
     * @throws `ESPAPICallValidationError` if the group ID is missing in the request parameters.
     */
    getGroupById(
      getGroupByIdRequestParams: GetGroupByIdRequestParams
    ): Promise<ESPRMGroup>;
  }
}

/**
 * Retrieves a group by its ID based on the provided request parameters.
 *
 * @param getGroupByIdRequestParams - Parameters to filter the group data.
 * @returns A promise that resolves to the retrieved group instance.
 * @throws `ESPAPICallValidationError` if the group ID is not provided in the request parameters.
 */
ESPRMUser.prototype.getGroupById = async function (
  getGroupByIdRequestParams: GetGroupByIdRequestParams
): Promise<ESPRMGroup> {
  if (!getGroupByIdRequestParams.id) {
    throw new ESPAPICallValidationError(
      APICallValidationErrorCodes.MISSING_GROUP_ID
    );
  }

  const requestData = createRequestData(getGroupByIdRequestParams);

  const requestConfig = {
    url: APIEndpoints.USER_GROUP,
    method: HTTPMethods.GET,
    params: requestData,
  };

  const response = await ESPRMAPIManager.authorizeRequest(requestConfig);
  const transformedGroupInfo = transformGroupsResponse(response.groups);
  const groupInstance = new ESPRMGroup(transformedGroupInfo[0]);

  return groupInstance;
};

/**
 * Creates the request data for retrieving a group by its ID.
 *
 * @param getGroupByIdRequestParams - Parameters to filter the group data by ID and optional additional details.
 * @returns A record representing the formatted request payload.
 */
function createRequestData(
  getGroupByIdRequestParams: GetGroupByIdRequestParams
): Record<string, any> {
  return {
    ...(getGroupByIdRequestParams.id !== undefined && {
      group_id: getGroupByIdRequestParams.id,
    }),
    ...(getGroupByIdRequestParams.withNodeList !== undefined && {
      node_list: getGroupByIdRequestParams.withNodeList,
    }),
    ...(getGroupByIdRequestParams.withNodeDetails !== undefined && {
      node_details: getGroupByIdRequestParams.withNodeDetails,
    }),
    ...(getGroupByIdRequestParams.withSubGroups !== undefined && {
      sub_groups: getGroupByIdRequestParams.withSubGroups,
    }),
  };
}
