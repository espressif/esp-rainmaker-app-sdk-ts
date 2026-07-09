/*
 * SPDX-FileCopyrightText: 2026 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMNode } from "../../ESPRMNode";
import { cancelCmdRespRequest } from "../../services/ESPRMHelpers/ESPCmdRespHelpers";
import { ESPCmdRespCancelRequest } from "../../types/input";
import { ESPCmdRespCancelResponse } from "../../types/output";

/**
 * Augments the ESPRMNode class with the `cancelCmdRespRequest` method.
 */
declare module "../../ESPRMNode" {
  interface ESPRMNode {
    /**
     * Cancels pending command-response request(s).
     *
     * Can cancel:
     * - A specific request by `requestId`
     * - All pending commands for this node (when only `nodeId` context is used)
     * - Pending commands for this node with a specific `cmdId`
     *
     * @param params - Cancellation parameters. At least `requestId` or `nodeId` is required.
     * @returns Cancellation status and count of removed requests.
     */
    cancelCmdRespRequest(
      params: ESPCmdRespCancelRequest
    ): Promise<ESPCmdRespCancelResponse>;
  }
}

ESPRMNode.prototype.cancelCmdRespRequest = async function (
  params: ESPCmdRespCancelRequest
): Promise<ESPCmdRespCancelResponse> {
  return cancelCmdRespRequest({
    ...params,
    nodeId: this.id,
  });
};
