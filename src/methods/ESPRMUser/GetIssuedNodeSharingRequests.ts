/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMUser } from "../../ESPRMUser";
import { FetchNodeSharingRequestsParam } from "../../types/input";
import { ESPNodeSharingResponse } from "../../types/output";
import { fetchNodeSharingRequests } from "./FetchNodeSharingRequests";

/**
 * Augments the `ESPRMUser` class with the `getIssuedNodeSharingRequests` method.
 * This method allows fetching node sharing requests for a user with optional pagination.
 */
declare module "../../ESPRMUser" {
  interface ESPRMUser {
    /**
     * Fetches node sharing requests for the user with optional pagination.
     *
     * @param {number} [pageCount] - The number of results to fetch per request. If not provided, the default value is used.
     * @returns {Promise<ESPNodeSharingResponse>} A promise that resolves to a paginated response containing node sharing requests.
     */
    getIssuedNodeSharingRequests(
      pageCount?: number
    ): Promise<ESPNodeSharingResponse>;
  }
}

/**
 * Implementation of the `getIssuedNodeSharingRequests` method for the `ESPRMUser` class.
 * This method sends a request to fetch node sharing requests for the current user, with an optional
 * parameter to control pagination.
 *
 * @param {number} [pageCount] - Optional. The number of results to retrieve. If omitted, the default number of results is fetched.
 * @returns {Promise<ESPNodeSharingResponse>} A promise that resolves to the response with pagination details.
 */
ESPRMUser.prototype.getIssuedNodeSharingRequests = async function (
  pageCount?: number
): Promise<ESPNodeSharingResponse> {
  const request: FetchNodeSharingRequestsParam = {
    primaryUser: true,
    recordsNumber: pageCount,
  };

  return await fetchNodeSharingRequests(request);
};
