/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPAutomation } from "../../ESPAutomation";
import { ESPAPICallValidationError } from "../../utils/error/Error";
import { APICallValidationErrorCodes } from "../../utils/constants";
import { ESPAPIResponse } from "../../types/output";
import {
  ESPAutomationUpdateDetails,
  ESPAutomationAction,
} from "../../types/automation";

/**
 * Augments the ESPAutomation class with the `updateActions` method.
 */
declare module "../../ESPAutomation" {
  interface ESPAutomation {
    /**
     * Updates the actions of an existing automation.
     * @param actions - An array of action objects defining the actions to be performed when the automation is triggered.
     * @returns A promise that resolves to the API response after successful update.
     */
    updateActions(actions: ESPAutomationAction[]): Promise<ESPAPIResponse>;
  }
}

ESPAutomation.prototype.updateActions = async function (
  actions: ESPAutomationAction[]
): Promise<ESPAPIResponse> {
  if (!actions || actions.length === 0) {
    throw new ESPAPICallValidationError(
      APICallValidationErrorCodes.MISSING_AUTOMATION_ACTIONS
    );
  }

  const updateDetails: ESPAutomationUpdateDetails = {
    actions,
  };

  const response = await this.update(updateDetails);
  return response;
};
