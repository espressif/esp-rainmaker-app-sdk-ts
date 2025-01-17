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
 * Augments the `ESPGroupSharingRequest` class with the `decline` method.
 * This method allows a user to decline a group sharing request by its ID.
 */
declare module "../../ESPGroupSharingRequest" {
  interface ESPGroupSharingRequest {
    /**
     * Declines a group sharing request for the user.
     *
     * @returns {Promise<ESPAPIResponse>} A promise that resolves to a success response indicating the request was declined.
     */
    decline(): Promise<ESPAPIResponse>;
  }
}

/**
 * Implementation of the `decline` method for the `ESPGroupSharingRequest` class.
 * This method sends a request to decline a group sharing request for the current user.
 * Users can only decline invites that are shared with them.
 *
 * @returns {Promise<ESPAPIResponse>} A promise that resolves to a success response once the group sharing request is declined.
 */
ESPGroupSharingRequest.prototype.decline =
  async function (): Promise<ESPAPIResponse> {
    const requestData = {
      accept: false,
      request_id: this.id,
    };
    const requestConfig = {
      url: APIEndpoints.USER_GROUP_SHARING_REQUESTS,
      method: HTTPMethods.PUT,
      data: requestData,
    };

    const response = await ESPRMAPIManager.authorizeRequest(requestConfig);
    return response as ESPAPIResponse;
  };
