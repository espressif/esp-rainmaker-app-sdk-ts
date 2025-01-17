/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMGroup } from "../../ESPRMGroup";
import { ESPRMAPIManager } from "../../services/ESPRMAPIManager";
import { TransferGroupRequest } from "../../types/input";
import { APIEndpoints, HTTPMethods } from "../../utils/constants";

/**
 * Augments the ESPRMGroup class with the `transfer` method.
 */
declare module "../../ESPRMGroup" {
  interface ESPRMGroup {
    /**
     * Transfers the specified groups to another user.
     *
     * @param {TransferGroupRequest} transferGroupsRequestParams - The parameters needed for transferring groups.
     * @returns {Promise<string>} A promise that resolves to the request ID from the API.
     */
    transfer(
      transferGroupsRequestParams: TransferGroupRequest
    ): Promise<string>;
  }
}

/**
 * Implementation of the `transfer` method for the `ESPRMGroup` class.
 *
 * This method sends a PUT request to the API to transfer groups to another user.
 *
 * @param {TransferGroupRequest} transferGroupsRequestParams - The parameters including group IDs, target user, and role assignment.
 * @returns {Promise<string>} A promise that resolves with the request ID from the API response.
 */
ESPRMGroup.prototype.transfer = async function (
  transferGroupsRequestParams: TransferGroupRequest
): Promise<string> {
  const requestData = createRequestData(transferGroupsRequestParams, this.id);

  const requestConfig = {
    url: APIEndpoints.USER_GROUP_SHARING,
    method: HTTPMethods.PUT,
    data: requestData,
  };

  const response = await ESPRMAPIManager.authorizeRequest(requestConfig);
  return response.request_id;
};

/**
 * Helper function to create request data from the TransferGroupRequest object.
 *
 * This function converts the input parameters to a snake_case format suitable for the API request.
 *
 * @param {TransferGroupRequest} transferGroupsRequestParams - The input parameters for transferring groups.
 * @param {string} groupId - The ID of the group being transferred.
 * @returns {Record<string, any>} An object containing the request data in snake_case format.
 */
function createRequestData(
  transferGroupsRequestParams: TransferGroupRequest,
  groupId: string
): Record<string, any> {
  return {
    transfer: true,
    groups: [groupId],
    ...(transferGroupsRequestParams.toUserName && {
      user_name: transferGroupsRequestParams.toUserName,
    }),
    ...(transferGroupsRequestParams.assignRoleToSelf && {
      new_role: transferGroupsRequestParams.assignRoleToSelf,
    }),
    ...(transferGroupsRequestParams.metadata && {
      metadata: transferGroupsRequestParams.metadata,
    }),
  };
}
