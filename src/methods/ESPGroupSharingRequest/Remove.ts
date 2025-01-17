/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPGroupSharingRequest } from "../../ESPGroupSharingRequest";
import { ESPRMAPIManager } from "../../services/ESPRMAPIManager";
import { ESPAPIResponse } from "../../types/output";
import { APIEndpoints, HTTPMethods } from "../../utils/constants";

/**
 * Augments the `ESPGroupSharingRequest` class with the `remove` method.
 * This method allows a user to remove a group sharing request by its ID.
 */
declare module "../../ESPGroupSharingRequest" {
  interface ESPGroupSharingRequest {
    /**
     * Removes a group sharing request for the user.
     *
     * @returns {Promise<ESPAPIResponse>} A promise that resolves to a success response indicating the request was removed.
     */
    remove(): Promise<ESPAPIResponse>;
  }
}

/**
 * Implementation of the `remove` method for the `ESPGroupSharingRequest` class.
 * This method sends a request to remove a group sharing request for the current user.
 * Users can only remove requests that are shared by them.
 *
 * @returns {Promise<ESPAPIResponse>} A promise that resolves to a success response once the group sharing request is removed.
 */
ESPGroupSharingRequest.prototype.remove =
  async function (): Promise<ESPAPIResponse> {
    const requestData = {
      request_id: this.id,
    };
    const requestConfig = {
      url: APIEndpoints.USER_GROUP_SHARING_REQUESTS,
      method: HTTPMethods.DELETE,
      params: requestData,
    };

    const response = await ESPRMAPIManager.authorizeRequest(requestConfig);
    return response as ESPAPIResponse;
  };
