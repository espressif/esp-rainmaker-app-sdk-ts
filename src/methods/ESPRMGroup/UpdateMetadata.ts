/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMGroup } from "../../ESPRMGroup";
import { ESPRMAPIManager } from "../../services/ESPRMAPIManager";
import { ESPAPIResponse } from "../../types/output";
import { APIEndpoints, HTTPMethods } from "../../utils/constants";

/**
 * Augments the ESPRMGroup class with the `updateMetadata` method to update the group's metadata.
 */
declare module "../../ESPRMGroup" {
  interface ESPRMGroup {
    /**
     * Updates the metadata of the current group.
     *
     * @param {Record<string, any>} metadata - The new metadata to set for the group.
     * @returns {Promise<ESPAPIResponse>} A promise that resolves to the API success response.
     */
    updateMetadata(metadata: Record<string, any>): Promise<ESPAPIResponse>;
  }
}

/**
 * Implementation of the `updateMetadata` method for the `ESPRMGroup` class.
 *
 * This method sends a PUT request to the API to update the group's metadata. The group ID
 * is taken from the instance of `ESPRMGroup`, and the new metadata is provided as input.
 *
 * @param {Record<string, any>} metadata - The metadata to update for the group.
 * @returns {Promise<ESPAPIResponse>} A promise that resolves with the success response from the API.
 */
ESPRMGroup.prototype.updateMetadata = async function (
  metadata: Record<string, any>
): Promise<ESPAPIResponse> {
  const requestParams = { group_id: this.id };

  const requestData = {
    group_metadata: metadata,
  };

  const requestConfig = {
    url: APIEndpoints.USER_GROUP,
    method: HTTPMethods.PUT,
    data: requestData,
    params: requestParams,
  };

  // Send the request and return the response
  const response = await ESPRMAPIManager.authorizeRequest(requestConfig);
  return response as ESPAPIResponse;
};
