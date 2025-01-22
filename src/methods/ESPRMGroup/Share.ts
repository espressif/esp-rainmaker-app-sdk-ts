/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMGroup } from "../../ESPRMGroup";
import { ESPRMAPIManager } from "../../services/ESPRMAPIManager";
import { ShareGroupRequest } from "../../types/input";
import { APIEndpoints, HTTPMethods } from "../../utils/constants";

/**
 * Augments the ESPRMGroup class with the `Share` method.
 */
declare module "../../ESPRMGroup" {
  interface ESPRMGroup {
    /**
     * Shares the specified groups with a user.
     *
     * @param {ShareGroupRequest} shareGroupRequestParams - The parameters needed for sharing groups.
     * @returns {Promise<string>} A promise that resolves to the request ID from the API.
     */
    Share(shareGroupRequestParams: ShareGroupRequest): Promise<string>;
  }
}

/**
 * Implementation of the `Share` method for the `ESPRMGroup` class.
 *
 * This method sends a PUT request to the API for sharing groups with a specified user.
 *
 * @param {ShareGroupRequest} shareGroupRequestParams - The parameters including group IDs and target user information.
 * @returns {Promise<string>} A promise that resolves with the request ID from the API response.
 */
ESPRMGroup.prototype.Share = async function (
  shareGroupRequestParams: ShareGroupRequest
): Promise<string> {
  const requestData = createRequestData(shareGroupRequestParams, this.id);

  const requestConfig = {
    url: APIEndpoints.USER_GROUP_SHARING,
    method: HTTPMethods.PUT,
    data: requestData,
  };

  const response = await ESPRMAPIManager.authorizeRequest(requestConfig);
  return response.request_id;
};

/**
 * Helper function to create request data from the ShareGroupRequest object.
 *
 * This function converts the input parameters to a snake_case format suitable for the API request.
 *
 * @param {ShareGroupRequest} shareGroupRequestParams - The input parameters for sharing groups.
 * @param {string} groupId - The ID of the group being shared.
 * @returns {Record<string, any>} An object containing the request data in snake_case format.
 */
function createRequestData(
  shareGroupRequestParams: ShareGroupRequest,
  groupId: string
): Record<string, any> {
  return {
    groups: [groupId],
    ...(shareGroupRequestParams.toUserName && {
      user_name: shareGroupRequestParams.toUserName,
    }),
    ...(shareGroupRequestParams.makePrimary && {
      primary: shareGroupRequestParams.makePrimary,
    }),
    ...(shareGroupRequestParams.metadata && {
      metadata: shareGroupRequestParams.metadata,
    }),
  };
}
