/*
 * SPDX-FileCopyrightText: 2026 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMNode } from "../../ESPRMNode";
import { fetchCmdRespRequestList } from "../../services/ESPRMHelpers/ESPCmdRespHelpers";
import { ESPCmdRespListParams } from "../../types/input";
import { ESPCmdRespPaginatedResult } from "../../types/output";

/**
 * Augments the ESPRMNode class with the `getCmdRespRequestList` method.
 */
declare module "../../ESPRMNode" {
  interface ESPRMNode {
    /**
     * Fetches command-response requests for this node using optional filters.
     *
     * Supported query shapes (see RainMaker API docs):
     * - `requestId` — single record (optionally scoped with this node's id)
     * - `requestId` + node — single record
     * - `startTime` + `endTime` — history for this node
     * - optional `cmdId` or `status` — paginated list for this node
     *
     * When `nodeId` is omitted it defaults to this node's id.
     *
     * @param params - Filter and pagination options.
     * @returns Paginated command-response request records.
     */
    getCmdRespRequestList(
      params?: ESPCmdRespListParams
    ): Promise<ESPCmdRespPaginatedResult>;
  }
}

ESPRMNode.prototype.getCmdRespRequestList = async function (
  params: ESPCmdRespListParams = {}
): Promise<ESPCmdRespPaginatedResult> {
  return fetchCmdRespRequestList({
    ...params,
    nodeId: this.id,
  });
};
