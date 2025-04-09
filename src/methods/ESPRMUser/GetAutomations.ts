/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMUser } from "../../ESPRMUser";
import { ESPPaginatedAutomationsResponse } from "../../types/automation";
import { fetchAutomations } from "../../services/ESPRMHelpers/FetchAutomations";

/**
 * Augments the ESPRMUser class with the `getAutomations` method.
 */
declare module "../../ESPRMUser" {
  interface ESPRMUser {
    /**
     * Retrieves a list of all automations with optional pagination.
     * @returns A promise that resolves to a paginated response containing automation data.
     */
    getAutomations(): Promise<ESPPaginatedAutomationsResponse>;
  }
}

ESPRMUser.prototype.getAutomations =
  async function (): Promise<ESPPaginatedAutomationsResponse> {
    return await fetchAutomations({});
  };
