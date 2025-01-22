/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMGroup } from "../../ESPRMGroup";
import { ESPRMUser } from "../../ESPRMUser";
import { ESPRMAPIManager } from "../../services/ESPRMAPIManager";
import { transformGroupsResponse } from "../../services/ESPRMHelpers/TransformGroupsResponse";
import { GetGroupByNameRequestParams } from "../../types/input";
import {
  APICallValidationErrorCodes,
  APIEndpoints,
  HTTPMethods,
} from "../../utils/constants";
import { ESPAPICallValidationError } from "../../utils/error/Error";

/**
 * Augments the ESPRMUser class with the `getGroupByName` method to retrieve a group by its name.
 */
declare module "../../ESPRMUser" {
  interface ESPRMUser {
    /**
     * Retrieves a group by its name.
     * @param getGroupByNameRequestParams - Parameters to filter the group data by name.
     * @returns A promise that resolves to an instance of `ESPRMGroup`.
     * @throws `ESPAPICallValidationError` if the group name is missing in the request parameters.
     */
    getGroupByName(
      getGroupByNameRequestParams: GetGroupByNameRequestParams
    ): Promise<ESPRMGroup>;
  }
}

/**
 * Retrieves a group by its name based on the provided request parameters.
 *
 * @param getGroupByNameRequestParams - Parameters to filter the group data.
 * @returns A promise that resolves to the retrieved group instance.
 * @throws `ESPAPICallValidationError` if the group name is not provided in the request parameters.
 */
ESPRMUser.prototype.getGroupByName = async function (
  getGroupByNameRequestParams: GetGroupByNameRequestParams
): Promise<ESPRMGroup> {
  if (!getGroupByNameRequestParams.name) {
    throw new ESPAPICallValidationError(
      APICallValidationErrorCodes.MISSING_GROUP_NAME
    );
  }

  const requestData = createRequestData(getGroupByNameRequestParams);

  const requestConfig = {
    url: APIEndpoints.USER_GROUP,
    method: HTTPMethods.GET,
    params: requestData,
  };

  const response = await ESPRMAPIManager.authorizeRequest(requestConfig);
  const transformedGroupInfo = transformGroupsResponse(response[0].groups);
  const groupInstance = new ESPRMGroup(transformedGroupInfo[0]);

  return groupInstance;
};

/**
 * Creates the request data for retrieving a group by name.
 *
 * @param getGroupByNameRequestParams - Parameters to filter the group data by name and optional additional details.
 * @returns A record representing the formatted request payload.
 */
function createRequestData(
  getGroupByNameRequestParams: GetGroupByNameRequestParams
): Record<string, any> {
  return {
    ...(getGroupByNameRequestParams.name !== undefined && {
      group_name: getGroupByNameRequestParams.name,
    }),
    ...(getGroupByNameRequestParams.withNodeList !== undefined && {
      node_list: getGroupByNameRequestParams.withNodeList,
    }),
    ...(getGroupByNameRequestParams.withNodeDetails !== undefined && {
      node_details: getGroupByNameRequestParams.withNodeDetails,
    }),
    ...(getGroupByNameRequestParams.withSubGroups !== undefined && {
      sub_groups: getGroupByNameRequestParams.withSubGroups,
    }),
  };
}
