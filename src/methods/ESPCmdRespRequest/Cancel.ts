/*
 * SPDX-FileCopyrightText: 2026 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPCmdRespRequest } from "../../ESPCmdRespRequest";
import { cancelCmdRespRequest } from "../../services/ESPRMHelpers/ESPCmdRespHelpers";
import { ESPCmdRespCancelResponse } from "../../types/output";

/**
 * Augments the ESPCmdRespRequest class with the `cancel` method.
 */
declare module "../../ESPCmdRespRequest" {
  interface ESPCmdRespRequest {
    /**
     * Cancels this pending command-response request and updates {@link status}
     * to `cancelled` in place.
     *
     * @returns Cancellation status and count of removed requests.
     */
    cancel(): Promise<ESPCmdRespCancelResponse>;
  }
}

ESPCmdRespRequest.prototype.cancel =
  async function (): Promise<ESPCmdRespCancelResponse> {
    const response = await cancelCmdRespRequest({
      requestId: this.requestId,
      nodeId: this.nodeId,
    });
    this.status = "cancelled";
    return response;
  };
