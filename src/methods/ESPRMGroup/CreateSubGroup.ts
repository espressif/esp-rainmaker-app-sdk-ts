/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMGroup } from "../../ESPRMGroup";
import { ESPRMAPIManager } from "../../services/ESPRMAPIManager";
import { CreateSubGroupRequest, ESPRMGroupInterface } from "../../types/input";
import { CreateSubGroupAPIResponse } from "../../types/output";
import { APIEndpoints, HTTPMethods } from "../../utils/constants";

/**
 * Augments the ESPRMGroup class with the `createSubGroup` method to create sub-groups under a parent group.
 */
declare module "../../ESPRMGroup" {
  interface ESPRMGroup {
    /**
     * Creates a sub-group under the current group.
     * @param groupInfo - The details of the sub-group to be created.
     * @returns A promise that resolves to the created sub-group as an `ESPRMGroup` instance.
     */
    createSubGroup(groupInfo: CreateSubGroupRequest): Promise<ESPRMGroup>;
  }
}

/**
 * Creates a sub-group under the current group.
 *
 * @param createSubGroupRequestParams - The parameters for creating the sub-group.
 * @returns A promise that resolves to the created sub-group as an `ESPRMGroup` instance.
 */
ESPRMGroup.prototype.createSubGroup = async function (
  createSubGroupRequestParams: CreateSubGroupRequest
): Promise<ESPRMGroup> {
  const requestData = createRequestData(createSubGroupRequestParams, this.id);

  const requestConfig = {
    url: APIEndpoints.USER_GROUP,
    method: HTTPMethods.POST,
    data: requestData,
  };

  const responseData: CreateSubGroupAPIResponse =
    await ESPRMAPIManager.authorizeRequest(requestConfig);

  const groupInfoWithId: ESPRMGroupInterface = {
    ...createSubGroupRequestParams,
    parentGroupId: this.id,
    id: responseData.group_id,
  };
  const groupInstance = new ESPRMGroup(groupInfoWithId);

  return groupInstance;
};

/**
 * Creates the request payload for creating a sub-group.
 *
 * @param createSubGroupRequestParams - The parameters for the sub-group creation request.
 * @param parentGroupId - The ID of the parent group.
 * @returns A record representing the formatted request payload.
 */
function createRequestData(
  createSubGroupRequestParams: CreateSubGroupRequest,
  parentGroupId: string
): Record<string, any> {
  return {
    group_name: createSubGroupRequestParams.name,
    parent_group_id: parentGroupId,
    ...(createSubGroupRequestParams.nodeIds !== undefined && {
      nodes: createSubGroupRequestParams.nodeIds,
    }),
    ...(createSubGroupRequestParams.description !== undefined && {
      description: createSubGroupRequestParams.description,
    }),
    ...(createSubGroupRequestParams.customData !== undefined && {
      custom_data: createSubGroupRequestParams.customData,
    }),
    ...(createSubGroupRequestParams.type !== undefined && {
      type: createSubGroupRequestParams.type,
    }),
    ...(createSubGroupRequestParams.mutuallyExclusive !== undefined && {
      mutually_exclusive: createSubGroupRequestParams.mutuallyExclusive,
    }),
  };
}
