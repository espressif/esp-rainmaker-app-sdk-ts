/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPAutomation } from "../../ESPAutomation";
import { ESPAPIResponse } from "../../types/output";
import { ESPAutomationUpdateDetails } from "../../types/automation";

/**
 * Augments the ESPAutomation class with the `setRetrigger` method.
 */
declare module "../../ESPAutomation" {
  interface ESPAutomation {
    /**
     * Updates the retrigger option of an existing automation.
     * @param retrigger - A boolean indicating whether the automation can be triggered more than once while the conditions are met.
     * @returns A promise that resolves to the API response after successful update.
     */
    setRetrigger(retrigger: boolean): Promise<ESPAPIResponse>;
  }
}

ESPAutomation.prototype.setRetrigger = async function (
  retrigger: boolean
): Promise<ESPAPIResponse> {
  const updateDetails: ESPAutomationUpdateDetails = {
    retrigger,
  };

  const response = await this.update(updateDetails);
  return response;
};
