/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMNode } from "../../ESPRMNode";
import { ESPPaginatedAutomationsResponse } from "../../types/automation";
import { fetchAutomations } from "../../services/ESPRMHelpers/FetchAutomations";

/**
 * Augments the ESPRMNode class with the `getAutomations` method.
 */
declare module "../../ESPRMNode" {
  interface ESPRMNode {
    /**
     * Retrieves a list of all automations for this node with optional pagination.
     * @returns A promise that resolves to a paginated response containing automation data.
     */
    getAutomations(): Promise<ESPPaginatedAutomationsResponse>;
  }
}

ESPRMNode.prototype.getAutomations =
  async function (): Promise<ESPPaginatedAutomationsResponse> {
    return await fetchAutomations({ nodeId: this.id });
  };
