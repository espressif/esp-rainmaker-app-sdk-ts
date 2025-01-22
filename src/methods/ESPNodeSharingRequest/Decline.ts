/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPNodeSharingRequest } from "../../ESPNodeSharingRequest";
import { ESPRMAPIManager } from "../../services/ESPRMAPIManager";
import { ESPAPIResponse } from "../../types/output";
import { APIEndpoints, HTTPMethods } from "../../utils/constants";

/**
 * Augments the `ESPNodeSharingRequest` class with the `decline` method.
 * This method allows a user to decline a node sharing request by its ID.
 */
declare module "../../ESPNodeSharingRequest" {
  interface ESPNodeSharingRequest {
    /**
     * Declines a node sharing request for the user.
     *
     * @returns {Promise<ESPAPIResponse>} A promise that resolves to a success response indicating the request was declined.
     */
    decline(): Promise<ESPAPIResponse>;
  }
}

/**
 * Implementation of the `decline` method for the `ESPNodeSharingRequest` class.
 * This method sends a request to decline a node sharing request for the current user.
 * Users can only decline invites that are shared with them.
 *
 * @returns {Promise<ESPAPIResponse>} A promise that resolves to a success response once the node sharing request is declined.
 */
ESPNodeSharingRequest.prototype.decline =
  async function (): Promise<ESPAPIResponse> {
    const requestData = {
      accept: false,
      request_id: this.id,
    };
    const requestConfig = {
      url: APIEndpoints.USER_NODE_SHARING_REQUESTS,
      method: HTTPMethods.PUT,
      data: requestData,
    };

    const response = await ESPRMAPIManager.authorizeRequest(requestConfig);
    return response as ESPAPIResponse;
  };
