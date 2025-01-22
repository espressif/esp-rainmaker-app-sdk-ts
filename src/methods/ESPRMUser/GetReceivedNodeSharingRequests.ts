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
 * Augments the `ESPRMUser` class with the `getReceivedNodeSharingRequests` method.
 * This method allows fetching node sharing invitations for a user with optional pagination.
 */
declare module "../../ESPRMUser" {
  interface ESPRMUser {
    /**
     * Fetches node sharing invitations for the user with optional pagination.
     *
     * @param {number} [resultCount] - The number of results to fetch per request. If not provided, the default value is used.
     * @returns {Promise<ESPNodeSharingResponse>} A promise that resolves to a paginated response containing node sharing invitations.
     */
    getReceivedNodeSharingRequests(
      resultCount?: number
    ): Promise<ESPNodeSharingResponse>;
  }
}

/**
 * Implementation of the `getReceivedNodeSharingRequests` method for the `ESPRMUser` class.
 * This method sends a request to fetch node sharing invitations for the current user, with an optional
 * parameter to control pagination.
 *
 * @param {number} [resultCount] - Optional. The number of results to retrieve. If omitted, the default number of results is fetched.
 * @returns {Promise<ESPNodeSharingResponse>} A promise that resolves to a paginated response containing the node sharing invitations.
 */
ESPRMUser.prototype.getReceivedNodeSharingRequests = async function (
  resultCount?: number
): Promise<ESPNodeSharingResponse> {
  const request: FetchNodeSharingRequestsParam = {
    primaryUser: false,
    recordsNumber: resultCount,
  };

  return await fetchNodeSharingRequests(request);
};
