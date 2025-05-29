/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPAutomation } from "../../ESPAutomation";
import { ESPAPIResponse } from "../../types/output";
import { ESPAutomationUpdateDetails } from "../../types/automation";

/**
 * Augments the ESPAutomation class with the `enable` method.
 */
declare module "../../ESPAutomation" {
  interface ESPAutomation {
    /**
     * Updates the enabled status of an existing automation.
     * @param enabled - The new enabled status for the automation.
     * @returns A promise that resolves to the API response after successful update.
     */
    enable(enabled: boolean): Promise<ESPAPIResponse>;
  }
}

ESPAutomation.prototype.enable = async function (
  enabled: boolean
): Promise<ESPAPIResponse> {
  const updateDetails: ESPAutomationUpdateDetails = {
    enabled,
  };

  const response = await this.update(updateDetails);
  return response;
};
