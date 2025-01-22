/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMNode } from "../../ESPRMNode";
import { ESPRMAPIManager } from "../../services/ESPRMAPIManager";
import { TransferNodeRequest } from "../../types/input";
import { APIEndpoints, HTTPMethods } from "../../utils/constants";

/**
 * Augments the `ESPRMNode` class with the `transferNode` method to facilitate
 * request creation to transfer the node to another user.
 */
declare module "../../ESPRMNode" {
  interface ESPRMNode {
    /**
     * Create Transfer request of the current node to a specified user.
     *
     * @param transferNodeRequestParams - Parameters specifying the user and transfer options.
     * @returns A promise that resolves to a requestId upon successful transfer request creation.
     */
    transferNode(
      transferNodeRequestParams: TransferNodeRequest
    ): Promise<string>;
  }
}

/**
 * Create Transfer request of the current node to a specified user.
 *
 * @param transferNodeRequestParams - Parameters specifying the user and transfer options.
 * @returns A promise that resolves to a requestId upon successful transfer request creation.
 */
ESPRMNode.prototype.transferNode = async function (
  transferNodeRequestParams: TransferNodeRequest
): Promise<string> {
  const requestData = createRequestData(transferNodeRequestParams, this.id);

  const requestConfig = {
    url: APIEndpoints.USER_NODE_SHARING,
    method: HTTPMethods.PUT,
    data: requestData,
  };

  const response = await ESPRMAPIManager.authorizeRequest(requestConfig);
  return response.request_id;
};

/**
 * Helper function to create request data from the TransferNodeRequest object.
 *
 * This function converts the input parameters to a snake_case format suitable for the API request.
 *
 * @param transferNodeRequestParams - The input parameters for transferring the node.
 * @param nodeId - The ID of the node being transferred.
 * @returns An object containing the request data in snake_case format.
 */
function createRequestData(
  transferNodeRequestParams: TransferNodeRequest,
  nodeId: string
): Record<string, any> {
  return {
    nodes: [nodeId],
    transfer: true,
    user_name: transferNodeRequestParams.toUserName,
    ...(transferNodeRequestParams.selfToSecondary && {
      new_role: "secondary",
    }),
  };
}
