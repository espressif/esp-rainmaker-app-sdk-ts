/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPGroupSharingRequest } from "../../ESPGroupSharingRequest";
import { ESPRMAPIManager } from "../../services/ESPRMAPIManager";
import { ESPAPIResponse } from "../../types/output";
import { APIEndpoints, HTTPMethods } from "../../utils/constants";

declare module "../../ESPGroupSharingRequest" {
  /**
   * Extends the `ESPGroupSharingRequest` class to include the `accept` method, allowing users to accept a group sharing request.
   *
   * @returns A Promise that resolves to the API response of the request.
   */
  interface ESPGroupSharingRequest {
    accept(): Promise<ESPAPIResponse>;
  }
}

/**
 * Accepts the group sharing request by sending a PUT request to the server.
 *
 * This method sets the `accept` flag to `true` and includes the `request_id` of the current group sharing request in the request data.
 * Users can only accept invites that are shared with them.
 *
 * @returns A Promise that resolves to an `ESPAPIResponse` object, which contains the response from the API.
 */
ESPGroupSharingRequest.prototype.accept =
  async function (): Promise<ESPAPIResponse> {
    const requestData = {
      accept: true,
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
