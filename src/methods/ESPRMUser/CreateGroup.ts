/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMGroup } from "../../ESPRMGroup";
import { ESPRMUser } from "../../ESPRMUser";
import { ESPRMAPIManager } from "../../services/ESPRMAPIManager";
import { CreateGroupRequest, ESPRMGroupInterface } from "../../types/input";
import { CreateGroupAPIResponse } from "../../types/output";
import { APIEndpoints, HTTPMethods } from "../../utils/constants";

/**
 * Extends the `ESPRMUser` class to include a method for creating groups.
 */
declare module "../../ESPRMUser" {
  interface ESPRMUser {
    /**
     * Creates a new group with the specified parameters.
     *
     * @param groupInfo - The details of the group to be created, including name, node IDs, description, and other optional fields.
     * @returns A promise that resolves to an instance of the newly created `ESPRMGroup`.
     */
    createGroup(groupInfo: CreateGroupRequest): Promise<ESPRMGroup>;
  }
}

/**
 * Implementation of the `createGroup` method for the `ESPRMUser` class.
 *
 * This method sends a request to create a group with the provided parameters,
 * processes the response, and returns an instance of the newly created group.
 *
 * @param createGroupRequestParams - The details of the group to be created.
 * @returns A promise that resolves to an instance of `ESPRMGroup`.
 */
ESPRMUser.prototype.createGroup = async function (
  createGroupRequestParams: CreateGroupRequest
): Promise<ESPRMGroup> {
  const requestData = createRequestData(createGroupRequestParams);

  const requestConfig = {
    url: APIEndpoints.USER_GROUP,
    method: HTTPMethods.POST,
    data: requestData,
  };

  const responseData: CreateGroupAPIResponse =
    await ESPRMAPIManager.authorizeRequest(requestConfig);

  const groupInfoWithId: ESPRMGroupInterface = {
    ...createGroupRequestParams,
    id: responseData.group_id,
    isPrimaryUser: true,
  };
  const groupInstance = new ESPRMGroup(groupInfoWithId);

  return groupInstance;
};

/**
 * Utility function to create the request data for the group creation API.
 *
 * This function transforms the provided group creation parameters into the
 * format expected by the API.
 *
 * @param createGroupRequestParams - The group creation parameters.
 * @returns A record containing the formatted request data.
 */
function createRequestData(
  createGroupRequestParams: CreateGroupRequest
): Record<string, any> {
  return {
    group_name: createGroupRequestParams.name,
    ...(createGroupRequestParams.nodeIds !== undefined && {
      nodes: createGroupRequestParams.nodeIds,
    }),
    ...(createGroupRequestParams.description !== undefined && {
      description: createGroupRequestParams.description,
    }),
    ...(createGroupRequestParams.customData !== undefined && {
      custom_data: createGroupRequestParams.customData,
    }),
    ...(createGroupRequestParams.type !== undefined && {
      type: createGroupRequestParams.type,
    }),
    ...(createGroupRequestParams.mutuallyExclusive !== undefined && {
      mutually_exclusive: createGroupRequestParams.mutuallyExclusive,
    }),
  };
}
