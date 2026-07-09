/*
 * SPDX-FileCopyrightText: 2026 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMNode } from "../../ESPRMNode";
import { createCmdRespRequest } from "../../services/ESPRMHelpers/ESPCmdRespHelpers";
import { ESPCmdRespNodeSendRequest } from "../../types/input";
import { ESPCmdRespSendAPIResponse } from "../../types/output";

/**
 * Augments the ESPRMNode class with the `createCmdRespRequest` method.
 */
declare module "../../ESPRMNode" {
  interface ESPRMNode {
    /**
     * Sends a command-response request to this node.
     *
     * @param params - Command id, payload, and optional timeout/encoding flags.
     * @returns A promise that resolves to the creation response (200 OK or 207 Multi-Status).
     */
    createCmdRespRequest(
      params: ESPCmdRespNodeSendRequest
    ): Promise<ESPCmdRespSendAPIResponse>;
  }
}

ESPRMNode.prototype.createCmdRespRequest = async function (
  params: ESPCmdRespNodeSendRequest
): Promise<ESPCmdRespSendAPIResponse> {
  return createCmdRespRequest({
    ...params,
    nodeIds: [this.id],
  });
};
