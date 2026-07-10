/*
 * SPDX-FileCopyrightText: 2026 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMUser } from "../../ESPRMUser";
import { fetchCmdRespRequestList } from "../../services/ESPRMHelpers/ESPCmdRespHelpers";
import { ESPCmdRespListParams } from "../../types/input";
import { ESPCmdRespPaginatedResult } from "../../types/output";

/**
 * Augments the ESPRMUser class with the `getCmdRespRequestList` method.
 */
declare module "../../ESPRMUser" {
  interface ESPRMUser {
    /**
     * Fetches command-response requests for the current user using optional filters.
     *
     * Supported query shapes (see RainMaker API docs):
     * - `requestId` — single record
     * - `requestId` + `nodeId` — single record
     * - `nodeId` + `startTime` + `endTime` — history
     * - `nodeId` with optional `cmdId` or `status` — paginated list
     * - `status` alone — all requests for the current user with that status
     *
     * @param params - Filter and pagination options.
     * @returns Paginated command-response request records.
     */
    getCmdRespRequestList(
      params: ESPCmdRespListParams
    ): Promise<ESPCmdRespPaginatedResult>;
  }
}

ESPRMUser.prototype.getCmdRespRequestList = async function (
  params: ESPCmdRespListParams
): Promise<ESPCmdRespPaginatedResult> {
  return fetchCmdRespRequestList(params);
};
