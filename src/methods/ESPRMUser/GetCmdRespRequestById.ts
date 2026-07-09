/*
 * SPDX-FileCopyrightText: 2026 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMUser } from "../../ESPRMUser";
import { fetchCmdRespRequestById } from "../../services/ESPRMHelpers/ESPCmdRespHelpers";
import { ESPCmdRespRequest } from "../../ESPCmdRespRequest";

/**
 * Augments the ESPRMUser class with the `getCmdRespRequestById` method.
 */
declare module "../../ESPRMUser" {
  interface ESPRMUser {
    /**
     * Fetches command-response request(s) by id previously created via
     * {@link createCmdRespRequest}.
     *
     * When `nodeId` is omitted the lookup uses `requestId` alone and may return
     * multiple records (one per node for a multi-node send). Pass `nodeId` to
     * scope the query to a specific node.
     *
     * @param requestId - The request id returned by `createCmdRespRequest`.
     * @param nodeId - Optional node id to scope the lookup.
     * @returns A promise that resolves to matching request records (empty when
     *          the backend has no record for the id).
     */
    getCmdRespRequestById(
      requestId: string,
      nodeId?: string
    ): Promise<ESPCmdRespRequest[]>;
  }
}

ESPRMUser.prototype.getCmdRespRequestById = async function (
  requestId: string,
  nodeId?: string
): Promise<ESPCmdRespRequest[]> {
  return fetchCmdRespRequestById(requestId, nodeId);
};
