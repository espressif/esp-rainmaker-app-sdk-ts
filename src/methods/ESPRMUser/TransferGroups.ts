/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMUser } from "../../ESPRMUser";
import { ESPRMAPIManager } from "../../services/ESPRMAPIManager";
import { TransferGroupsRequest } from "../../types/input";
import { APIEndpoints, HTTPMethods } from "../../utils/constants";

/**
 * Augments the ESPRMUser class with the `transferGroups` method.
 */
declare module "../../ESPRMUser" {
  interface ESPRMUser {
    /**
     * Transfers the specified groups to another user.
     *
     * @param {TransferGroupsRequest} transferGroupsRequestParams - The parameters needed for transferring groups.
     * @returns {Promise<string>} A promise that resolves to the request ID from the API.
     */
    transferGroups(
      transferGroupsRequestParams: TransferGroupsRequest
    ): Promise<string>;
  }
}

/**
 * Implementation of the `transferGroups` method for the `ESPRMUser` class.
 *
 * This method sends a PUT request to the API to transfer groups to another user.
 *
 * @param {TransferGroupsRequest} transferGroupsRequestParams - The parameters including group IDs, target user, and role assignment.
 * @returns {Promise<string>} A promise that resolves with the request ID from the API response.
 */
ESPRMUser.prototype.transferGroups = async function (
  transferGroupsRequestParams: TransferGroupsRequest
): Promise<string> {
  const requestData = createRequestData(transferGroupsRequestParams);

  const requestConfig = {
    url: APIEndpoints.USER_GROUP_SHARING,
    method: HTTPMethods.PUT,
    data: requestData,
  };

  const response = await ESPRMAPIManager.authorizeRequest(requestConfig);
  return response.request_id;
};

/**
 * Helper function to create request data from the TransferGroupsRequest object.
 *
 * This function converts the input parameters to a snake_case format suitable for the API request.
 *
 * @param {TransferGroupsRequest} transferGroupsRequestParams - The input parameters for transferring groups.
 * @returns {Record<string, any>} An object containing the request data in snake_case format.
 */
function createRequestData(
  transferGroupsRequestParams: TransferGroupsRequest
): Record<string, any> {
  return {
    transfer: true,
    ...(transferGroupsRequestParams.groupIds && {
      groups: transferGroupsRequestParams.groupIds,
    }),
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
