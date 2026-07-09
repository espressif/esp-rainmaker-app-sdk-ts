/*
 * SPDX-FileCopyrightText: 2026 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMUser } from "../../ESPRMUser";
import { fetchFileList } from "../../services/ESPRMHelpers/ESPFileHelpers";
import { ESPFile } from "../../ESPFile";
import { ESPFileGetByIdParams } from "../../types/input";

/**
 * Augments the ESPRMUser class with the `getFileById` method.
 */
declare module "../../ESPRMUser" {
  interface ESPRMUser {
    /**
     * Fetches a single uploaded file by id.
     *
     * @param fileId - The file id to look up.
     * @param params - Optional lookup scope such as `userName` for public files.
     * @returns The file record, or `null` when not found.
     */
    getFileById(
      fileId: string,
      params?: ESPFileGetByIdParams
    ): Promise<ESPFile | null>;
  }
}

ESPRMUser.prototype.getFileById = async function (
  fileId: string,
  params: ESPFileGetByIdParams = {}
): Promise<ESPFile | null> {
  const result = await fetchFileList({ fileId, ...params });
  const record = result.files[0];
  return record ? new ESPFile(record) : null;
};
