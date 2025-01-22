/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMUser } from "../../ESPRMUser";
import { ESPRMAPIManager } from "../../services/ESPRMAPIManager";
import { ShareGroupsRequest } from "../../types/input";
import { APIEndpoints, HTTPMethods } from "../../utils/constants";

/**
 * Augments the ESPRMUser class with the `shareGroups` method.
 */
declare module "../../ESPRMUser" {
  interface ESPRMUser {
    /**
     * Shares the specified groups with a user.
     *
     * @param {ShareGroupsRequest} shareGroupsRequestParams - The parameters needed for sharing groups.
     * @returns {Promise<string>} A promise that resolves to the request ID from the API.
     */
    shareGroups(shareGroupsRequestParams: ShareGroupsRequest): Promise<string>;
  }
}

/**
 * Implementation of the `shareGroups` method for the `ESPRMUser` class.
 *
 * This method sends a PUT request to the API for sharing groups with a specified user.
 *
 * @param {ShareGroupsRequest} shareGroupsRequestParams - The parameters including group IDs and target user information.
 * @returns {Promise<string>} A promise that resolves with the request ID from the API response.
 */
ESPRMUser.prototype.shareGroups = async function (
  shareGroupsRequestParams: ShareGroupsRequest
): Promise<string> {
  const requestData = createRequestData(shareGroupsRequestParams);

  const requestConfig = {
    url: APIEndpoints.USER_GROUP_SHARING,
    method: HTTPMethods.PUT,
    data: requestData,
  };

  const response = await ESPRMAPIManager.authorizeRequest(requestConfig);
  return response.request_id;
};

/**
 * Helper function to create request data from the ShareGroupsRequest object.
 *
 * This function converts the input parameters to a snake_case format suitable for the API request.
 *
 * @param {ShareGroupsRequest} shareGroupsRequestParams - The input parameters for sharing groups.
 * @returns {Record<string, any>} An object containing the request data in snake_case format.
 */
function createRequestData(
  shareGroupsRequestParams: ShareGroupsRequest
): Record<string, any> {
  return {
    ...(shareGroupsRequestParams.groupIds && {
      groups: shareGroupsRequestParams.groupIds,
    }),
    ...(shareGroupsRequestParams.toUserName && {
      user_name: shareGroupsRequestParams.toUserName,
    }),
    ...(shareGroupsRequestParams.makePrimary && {
      primary: shareGroupsRequestParams.makePrimary,
    }),
    ...(shareGroupsRequestParams.metadata && {
      metadata: shareGroupsRequestParams.metadata,
    }),
  };
}
