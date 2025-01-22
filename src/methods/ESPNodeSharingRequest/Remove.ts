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
 * Augments the `ESPNodeSharingRequest` class with the `remove` method.
 * This method allows a user to remove a node sharing request by its ID.
 */
declare module "../../ESPNodeSharingRequest" {
  interface ESPNodeSharingRequest {
    /**
     * Removes a node sharing request for the user.
     *
     * @returns {Promise<ESPAPIResponse>} A promise that resolves to a success response indicating the request was removed.
     */
    remove(): Promise<ESPAPIResponse>;
  }
}

/**
 * Implementation of the `remove` method for the `ESPNodeSharingRequest` class.
 * This method sends a request to remove a node sharing request for the current user.
 * Users can only remove requests that are shared by them.
 *
 * @returns {Promise<ESPAPIResponse>} A promise that resolves to a success response once the node sharing request is removed.
 */
ESPNodeSharingRequest.prototype.remove =
  async function (): Promise<ESPAPIResponse> {
    const requestData = {
      request_id: this.id,
    };
    const requestConfig = {
      url: APIEndpoints.USER_NODE_SHARING_REQUESTS,
      method: HTTPMethods.DELETE,
      params: requestData,
    };

    const response = await ESPRMAPIManager.authorizeRequest(requestConfig);
    return response as ESPAPIResponse;
  };
