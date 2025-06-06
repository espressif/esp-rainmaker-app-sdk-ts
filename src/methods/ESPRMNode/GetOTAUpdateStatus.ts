/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMNode } from "../../ESPRMNode";
import { ESPRMAPIManager } from "../../services/ESPRMAPIManager";
import {
  ESPOTAUpdateStatusResponse,
  ESPRawOTAUpdateStatusResponse,
} from "../../types/ota";
import {
  APICallValidationErrorCodes,
  APIEndpoints,
  HTTPMethods,
} from "../../utils/constants";
import { ESPAPICallValidationError } from "../../utils/error/Error";
import { isNonEmptyString } from "../../utils/validator/validators";

/**
 * Augments the `ESPRMNode` class with the `getOTAUpdateStatus` method to check the status of an OTA update.
 */
declare module "../../ESPRMNode" {
  interface ESPRMNode {
    /**
     * Checks the status of a previously initiated Over-The-Air (OTA) update for the node.
     * @param otaJobId - The ID of the OTA job for which the status is being checked.
     * @returns A promise that resolves to an `ESPOTAUpdateStatusResponse` object containing details about the OTA update status.
     * @throws {ESPAPICallValidationError} If the OTA job ID is missing or invalid.
     */
    getOTAUpdateStatus(otaJobId: string): Promise<ESPOTAUpdateStatusResponse>;
  }
}

ESPRMNode.prototype.getOTAUpdateStatus = async function (
  otaJobId: string
): Promise<ESPOTAUpdateStatusResponse> {
  // Validate that otaJobId is provided and is a valid string
  if (!isNonEmptyString(otaJobId)) {
    throw new ESPAPICallValidationError(
      APICallValidationErrorCodes.MISSING_OTA_JOB_ID
    );
  }

  const requestParams = {
    node_id: this.id,
    ota_job_id: otaJobId,
  };

  const requestConfig = {
    url: APIEndpoints.USER_NODES_OTA_STATUS,
    method: HTTPMethods.GET,
    params: requestParams,
  };

  const response: ESPRawOTAUpdateStatusResponse =
    await ESPRMAPIManager.authorizeRequest(requestConfig);
  return transformOTAUpdateStatusResponse(response);
};

/**
 * Transforms the backend response to the ESPOTAUpdateStatusResponse format
 * @param response The backend response
 * @returns The transformed ESPOTAUpdateStatusResponse object
 */
function transformOTAUpdateStatusResponse(
  response: ESPRawOTAUpdateStatusResponse
): ESPOTAUpdateStatusResponse {
  return {
    nodeId: response.node_id,
    status: response.status,
    additionalInfo: response.additional_info,
    timestamp: response.timestamp,
  };
}
