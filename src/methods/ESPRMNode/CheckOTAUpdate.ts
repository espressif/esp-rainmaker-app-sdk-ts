/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMNode } from "../../ESPRMNode";
import { ESPRMAPIManager } from "../../services/ESPRMAPIManager";
import { ESPOTAUpdateResponse, ESPRawOTAUpdateResponse } from "../../types/ota";
import { APIEndpoints, HTTPMethods } from "../../utils/constants";

/**
 * Augments the `ESPRMNode` class with the `checkOTAUpdate` method to check if there is an OTA update available.
 */
declare module "../../ESPRMNode" {
  interface ESPRMNode {
    /**
     * Checks if there is an Over-The-Air (OTA) update available for the node.
     * @returns A promise that resolves to an `ESPOTAUpdateResponse` object containing details about the OTA update availability.
     */
    checkOTAUpdate(): Promise<ESPOTAUpdateResponse>;
  }
}

ESPRMNode.prototype.checkOTAUpdate =
  async function (): Promise<ESPOTAUpdateResponse> {
    const requestParams = {
      node_id: this.id,
    };

    const requestConfig = {
      url: APIEndpoints.USER_NODES_OTA_UPDATE,
      method: HTTPMethods.GET,
      params: requestParams,
    };

    const responseData: ESPRawOTAUpdateResponse =
      await ESPRMAPIManager.authorizeRequest(requestConfig);
    return transformOTAUpdateResponse(responseData);
  };

/**
 * Transforms the backend response to the ESPOTAUpdateResponse format
 * @param response The backend response
 * @returns The transformed ESPOTAUpdateResponse object
 */
function transformOTAUpdateResponse(
  response: ESPRawOTAUpdateResponse
): ESPOTAUpdateResponse {
  return {
    status: response.status,
    otaAvailable: response.ota_available,
    description: response.description,
    fwVersion: response.fw_version,
    otaJobId: response.ota_job_id,
    fileSize: response.file_size,
    ...(response.url !== undefined && { url: response.url }),
    ...(response.file_md5 !== undefined && { fileMD5: response.file_md5 }),
    ...(response.stream_id !== undefined && { streamId: response.stream_id }),
    ...(response.metadata !== undefined && { metadata: response.metadata }),
  };
}
