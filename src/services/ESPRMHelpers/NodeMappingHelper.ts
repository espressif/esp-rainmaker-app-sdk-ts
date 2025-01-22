/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMAPIManager } from "../../services/ESPRMAPIManager";
import {
  APIEndpoints,
  HTTPMethods,
  APICallValidationErrorCodes,
  APIOperations,
} from "../../utils/constants";
import { ESPAPICallValidationError } from "../../utils/error/Error";

/**
 * Helper module for managing node mapping-related operations.
 */
export const NodeMappingHelper = {
  /**
   * Retrieves the status of a node mapping request.
   *
   * @param requestID - The unique identifier of the node mapping request.
   *                    This parameter is required.
   *
   * @returns A promise that resolves to the status of the node mapping request.
   *
   * @throws {Error} If the API request fails.
   */
  async getNodeMappingStatus(requestID: string): Promise<string> {
    const requestData = {
      request_id: requestID,
    };

    const requestConfig = {
      url: APIEndpoints.USER_NODE_MAP,
      method: HTTPMethods.GET,
      params: requestData,
    };

    const response = await ESPRMAPIManager.authorizeRequest(requestConfig);
    return response.request_status;
  },

  /**
   * Associates a node with a user by mapping the provided node ID to a secret key.
   *
   * @param nodeId - The unique identifier of the node to be mapped.
   *                 This parameter is required.
   * @param secretKey - The secret key corresponding to the node.
   *                    This parameter is required.
   *
   * @returns A promise that resolves to the `request_id` generated for this operation.
   *
   * @throws {ESPAPICallValidationError} If the `nodeId` or `secretKey` is missing.
   * @throws {Error} If the API request fails.
   */
  async addNodeMapping(nodeId: string, secretKey: string): Promise<string> {
    if (!nodeId) {
      throw new ESPAPICallValidationError(
        APICallValidationErrorCodes.MISSING_NODE_ID
      );
    }

    if (!secretKey) {
      throw new ESPAPICallValidationError(
        APICallValidationErrorCodes.MISSING_SECRET_KEY
      );
    }

    const requestData = {
      node_id: nodeId,
      secret_key: secretKey,
      operation: APIOperations.ADD,
    };

    const requestConfig = {
      url: APIEndpoints.USER_NODE_MAP,
      method: HTTPMethods.PUT,
      data: requestData,
    };

    const response = await ESPRMAPIManager.authorizeRequest(requestConfig);
    return response.request_id;
  },
};
