/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMNode } from "../../ESPRMNode";
import { ESPRMAPIManager } from "../../services/ESPRMAPIManager";
import { ShareWithRequest } from "../../types/input";
import { APIEndpoints, HTTPMethods } from "../../utils/constants";

/**
 * Augments the `ESPRMNode` class with the `shareWith` method to facilitate
 * sharing the node with other users.
 */
declare module "../../ESPRMNode" {
  interface ESPRMNode {
    shareWith(shareNodeWithRequestParams: ShareWithRequest): Promise<string>;
  }
}

/**
 * Shares the current node with specified users.
 *
 * @param shareNodeWithRequestParams - Parameters specifying the user and sharing options.
 * @returns A promise that resolves to a confirmation string upon successful sharing.
 */
ESPRMNode.prototype.shareWith = async function (
  shareNodeWithRequestParams: ShareWithRequest
): Promise<string> {
  const requestData = createRequestData(shareNodeWithRequestParams);
  const requestDataWithNode = {
    nodes: [this.id],
    ...requestData,
  };

  const requestConfig = {
    url: APIEndpoints.USER_NODE_SHARING,
    method: HTTPMethods.PUT,
    data: requestDataWithNode,
  };

  const response = await ESPRMAPIManager.authorizeRequest(requestConfig);
  return response.request_id;
};

/**
 * Helper function to create request data from the ShareWithRequest object.
 *
 * This function converts the input parameters to a snake_case format suitable for the API request.
 *
 * @param shareNodeWithRequestParams - The input parameters for sharing groups.
 * @returns An object containing the request data in snake_case format.
 */
function createRequestData(
  shareNodeWithRequestParams: ShareWithRequest
): Record<string, any> {
  return {
    user_name: shareNodeWithRequestParams.username,
    ...(shareNodeWithRequestParams.makePrimary !== undefined && {
      primary: shareNodeWithRequestParams.makePrimary,
    }),
    ...(shareNodeWithRequestParams.metadata !== undefined && {
      metadata: shareNodeWithRequestParams.metadata,
    }),
  };
}
