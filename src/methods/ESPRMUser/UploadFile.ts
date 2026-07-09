/*
 * SPDX-FileCopyrightText: 2026 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMUser } from "../../ESPRMUser";
import { ESPFile } from "../../ESPFile";
import {
  ESPFileUploadParams,
  ESPFileUploadProgressCallback,
  ESPFileUploadProgressStatus,
} from "../../types/input";
import { ESPFileUploadProgressMessages } from "../../utils/constants";

/**
 * Augments the ESPRMUser class with the `uploadFile` method.
 */
declare module "../../ESPRMUser" {
  interface ESPRMUser {
    /**
     * Uploads a file in one call: create upload request, PUT to S3, and confirm.
     *
     * @param content - File bytes to upload.
     * @param params - Upload and confirm fields for the file.
     * @param onProgress - Optional phase progress callback.
     * @returns A promise that resolves to the confirmed file record.
     * @throws {@link ESPFileError} When the S3 upload request fails.
     */
    uploadFile(
      content: Blob | ArrayBuffer | Uint8Array,
      params: ESPFileUploadParams,
      onProgress?: ESPFileUploadProgressCallback
    ): Promise<ESPFile>;
  }
}

ESPRMUser.prototype.uploadFile = async function (
  content: Blob | ArrayBuffer | Uint8Array,
  params: ESPFileUploadParams,
  onProgress?: ESPFileUploadProgressCallback
): Promise<ESPFile> {
  onProgress?.({
    status: ESPFileUploadProgressStatus.creatingRequest,
    message: ESPFileUploadProgressMessages.CREATING_REQUEST,
  });

  const uploadReq = await this.createFileUploadRequest(params);
  return uploadReq.upload(content, undefined, onProgress);
};
