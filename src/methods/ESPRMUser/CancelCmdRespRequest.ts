/*
 * SPDX-FileCopyrightText: 2026 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMUser } from "../../ESPRMUser";
import { cancelCmdRespRequest } from "../../services/ESPRMHelpers/ESPCmdRespHelpers";
import { ESPCmdRespCancelRequest } from "../../types/input";
import { ESPCmdRespCancelResponse } from "../../types/output";

/**
 * Augments the ESPRMUser class with the `cancelCmdRespRequest` method.
 */
declare module "../../ESPRMUser" {
  interface ESPRMUser {
    /**
     * Cancels pending command-response request(s).
     *
     * Can cancel:
     * - A specific request by `requestId` (across all nodes)
     * - All pending commands for a `nodeId`
     * - Pending commands for a `nodeId` with a specific `cmdId`
     *
     * @param params - Cancellation parameters. At least `requestId` or `nodeId` is required.
     * @returns Cancellation status and count of removed requests.
     */
    cancelCmdRespRequest(
      params: ESPCmdRespCancelRequest
    ): Promise<ESPCmdRespCancelResponse>;
  }
}

ESPRMUser.prototype.cancelCmdRespRequest = async function (
  params: ESPCmdRespCancelRequest
): Promise<ESPCmdRespCancelResponse> {
  return cancelCmdRespRequest(params);
};
