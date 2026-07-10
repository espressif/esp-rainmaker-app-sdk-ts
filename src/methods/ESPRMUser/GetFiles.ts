/*
 * SPDX-FileCopyrightText: 2026 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMUser } from "../../ESPRMUser";
import { ESPFile } from "../../ESPFile";
import { fetchFileList } from "../../services/ESPRMHelpers/ESPFileHelpers";
import { ESPFilePaginatedResultInterface } from "../../types/ESPModules";
import { ESPFileListParams } from "../../types/input";
import { ESPFilePaginatedResult } from "../../types/output";

/**
 * Augments the ESPRMUser class with the `getFiles` method.
 */
declare module "../../ESPRMUser" {
  interface ESPRMUser {
    /**
     * Fetches uploaded files for the current user with optional filters.
     *
     * @param params - Filter and pagination options.
     * @returns Paginated file records.
     */
    getFiles(params?: ESPFileListParams): Promise<ESPFilePaginatedResult>;
  }
}

function toESPFilePaginatedResult(
  result: ESPFilePaginatedResultInterface
): ESPFilePaginatedResult {
  return {
    files: result.files.map((file) => new ESPFile(file)),
    hasNext: result.hasNext,
    ...(result.fetchNext && {
      fetchNext: async () =>
        toESPFilePaginatedResult(await result.fetchNext!()),
    }),
  };
}

ESPRMUser.prototype.getFiles = async function (
  params: ESPFileListParams = {}
): Promise<ESPFilePaginatedResult> {
  return toESPFilePaginatedResult(await fetchFileList(params));
};
