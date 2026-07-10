/*
 * SPDX-FileCopyrightText: 2026 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPCmdRespRequest } from "../../ESPCmdRespRequest";
import { fetchCmdRespRequestById } from "../../services/ESPRMHelpers/ESPCmdRespHelpers";

/**
 * Augments the ESPCmdRespRequest class with the `getStatus` method.
 */
declare module "../../ESPCmdRespRequest" {
  interface ESPCmdRespRequest {
    /**
     * Fetches the latest command-response state from the cloud and updates
     * this instance in place.
     *
     * @returns This instance with refreshed fields, or `null` when no record exists.
     */
    getStatus(): Promise<ESPCmdRespRequest | null>;
  }
}

ESPCmdRespRequest.prototype.getStatus =
  async function (): Promise<ESPCmdRespRequest | null> {
    const records = await fetchCmdRespRequestById(this.requestId, this.nodeId);
    const record = records[0];
    if (!record) {
      return null;
    }

    this.applyUpdate(record);
    return this;
  };
