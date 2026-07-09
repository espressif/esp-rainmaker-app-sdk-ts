/*
 * SPDX-FileCopyrightText: 2026 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMUser } from "../../ESPRMUser";
import { ESPFileDownloadParams, ESPFileDownloadResult } from "../../types/input";
import { ErrorLabels, FileErrorCodes } from "../../utils/constants";
import { ESPFileError } from "../../utils/error/ESPFileError";

/**
 * Augments the ESPRMUser class with the `downloadFile` method.
 */
declare module "../../ESPRMUser" {
  interface ESPRMUser {
    /**
     * Downloads an uploaded file by id.
     *
     * @param fileId - The file id to download.
     * @param params - Optional lookup scope and download options.
     * @returns File bytes in the requested format.
     * @throws {@link ESPFileError} When the file record does not exist
     *         (label `ESPFileNotFoundError`).
     */
    downloadFile(
      fileId: string,
      params?: ESPFileDownloadParams
    ): Promise<ESPFileDownloadResult>;
  }
}

ESPRMUser.prototype.downloadFile = async function (
  fileId: string,
  params: ESPFileDownloadParams = {}
): Promise<ESPFileDownloadResult> {
  const file = await this.getFileById(fileId, params);

  if (!file) {
    throw new ESPFileError(
      ErrorLabels.ESPFileNotFoundError,
      FileErrorCodes.FILE_NOT_FOUND,
      { fileId }
    );
  }

  return file.download(params);
};
