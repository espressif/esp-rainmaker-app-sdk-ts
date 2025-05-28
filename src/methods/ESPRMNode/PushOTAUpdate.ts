/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMNode } from "../../ESPRMNode";
import { ESPRMAPIManager } from "../../services/ESPRMAPIManager";
import { ESPAPIResponse } from "../../types/output";
import {
  APICallValidationErrorCodes,
  APIEndpoints,
  HTTPMethods,
} from "../../utils/constants";
import { ESPAPICallValidationError } from "../../utils/error/Error";
import { isNonEmptyString } from "../../utils/validator/validators";
/**
 * Augments the `ESPRMNode` class with the `pushOTAUpdate` method to initiate an OTA update.
 */
declare module "../../ESPRMNode" {
  interface ESPRMNode {
    /**
     * Initiates an Over-The-Air (OTA) update for the node using a specified OTA job ID.
     * @param otaJobId - The ID of the OTA job to be used for the update.
     * @returns A promise that resolves to an `ESPAPIResponse` object confirming the successful initiation of the OTA update.
     * @throws {ESPAPICallValidationError} If the OTA job ID is missing or invalid.
     */
    pushOTAUpdate(otaJobId: string): Promise<ESPAPIResponse>;
  }
}

ESPRMNode.prototype.pushOTAUpdate = async function (
  otaJobId: string
): Promise<ESPAPIResponse> {
  // Validate that otaJobId is provided and is a valid string
  if (!isNonEmptyString(otaJobId)) {
    throw new ESPAPICallValidationError(
      APICallValidationErrorCodes.MISSING_OTA_JOB_ID
    );
  }

  const requestData = {
    ota_job_id: otaJobId,
    node_id: this.id,
  };

  const requestConfig = {
    url: APIEndpoints.USER_NODES_OTA_UPDATE,
    method: HTTPMethods.POST,
    data: requestData,
  };

  const response = await ESPRMAPIManager.authorizeRequest(requestConfig);
  return response as ESPAPIResponse;
};
