/*
 * SPDX-FileCopyrightText: 2026 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMUser } from "../../ESPRMUser";
import { fetchFileUploadRequest, splitUploadParams } from "../../services/ESPRMHelpers/ESPFileHelpers";
import { ESPFileUploadRequest } from "../../ESPFileUploadRequest";
import { ESPFileUploadParams } from "../../types/input";

/**
 * Augments the ESPRMUser class with the `createFileUploadRequest` method.
 */
declare module "../../ESPRMUser" {
  interface ESPRMUser {
    /**
     * Creates a file upload request and stores confirm metadata on the result.
     *
     * @param params - Upload and confirm fields for the file.
     * @returns A promise that resolves to the upload request instance.
     */
    createFileUploadRequest(
      params: ESPFileUploadParams
    ): Promise<ESPFileUploadRequest>;
  }
}

ESPRMUser.prototype.createFileUploadRequest = async function (
  params: ESPFileUploadParams
): Promise<ESPFileUploadRequest> {
  const { requestParams, confirmParams } = splitUploadParams(params);
  return new ESPFileUploadRequest(
    await fetchFileUploadRequest(requestParams, confirmParams)
  );
};
