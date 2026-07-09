/*
 * SPDX-FileCopyrightText: 2026 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMUser } from "../../ESPRMUser";
import { createCmdRespRequest } from "../../services/ESPRMHelpers/ESPCmdRespHelpers";
import { ESPCmdRespSendRequest } from "../../types/input";
import { ESPCmdRespSendAPIResponse } from "../../types/output";

/**
 * Augments the ESPRMUser class with the `createCmdRespRequest` method.
 */
declare module "../../ESPRMUser" {
  interface ESPRMUser {
    /**
     * Adds a command-response request for up to 25 nodes in a single call.
     *
     * @param params - Target node ids, command id, payload, and optional options.
     * @returns A promise that resolves to the creation response (200 OK or 207 Multi-Status).
     */
    createCmdRespRequest(
      params: ESPCmdRespSendRequest
    ): Promise<ESPCmdRespSendAPIResponse>;
  }
}

ESPRMUser.prototype.createCmdRespRequest = async function (
  params: ESPCmdRespSendRequest
): Promise<ESPCmdRespSendAPIResponse> {
  return createCmdRespRequest(params);
};
