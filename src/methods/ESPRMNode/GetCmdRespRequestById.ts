/*
 * SPDX-FileCopyrightText: 2026 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMNode } from "../../ESPRMNode";
import { fetchCmdRespRequestById } from "../../services/ESPRMHelpers/ESPCmdRespHelpers";
import { ESPCmdRespRequest } from "../../ESPCmdRespRequest";

/**
 * Augments the ESPRMNode class with the `getCmdRespRequestById` method.
 */
declare module "../../ESPRMNode" {
  interface ESPRMNode {
    /**
     * Fetches a command-response request by id previously created for this node
     * via {@link createCmdRespRequest}.
     *
     * @param requestId - The request id returned by `createCmdRespRequest`.
     * @returns A promise that resolves to the request record, or `null` if the
     *          backend has no record for the id.
     */
    getCmdRespRequestById(
      requestId: string
    ): Promise<ESPCmdRespRequest | null>;
  }
}

ESPRMNode.prototype.getCmdRespRequestById = async function (
  requestId: string
): Promise<ESPCmdRespRequest | null> {
  const records = await fetchCmdRespRequestById(requestId, this.id);
  return records[0] ?? null;
};
