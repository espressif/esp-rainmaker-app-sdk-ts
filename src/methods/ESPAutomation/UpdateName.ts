/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPAutomation } from "../../ESPAutomation";
import { ESPAPICallValidationError } from "../../utils/error/Error";
import { APICallValidationErrorCodes } from "../../utils/constants";
import { isNonEmptyString } from "../../utils/validator/validators";
import { ESPAPIResponse } from "../../types/output";
import { ESPAutomationUpdateDetails } from "../../types/automation";

/**
 * Augments the ESPAutomation class with the `updateName` method.
 */
declare module "../../ESPAutomation" {
  interface ESPAutomation {
    /**
     * Updates the name of an existing automation.
     * @param name - The new name for the automation.
     * @returns A promise that resolves to the API response after successful update.
     */
    updateName(name: string): Promise<ESPAPIResponse>;
  }
}

ESPAutomation.prototype.updateName = async function (
  name: string
): Promise<ESPAPIResponse> {
  if (!isNonEmptyString(name)) {
    throw new ESPAPICallValidationError(
      APICallValidationErrorCodes.MISSING_AUTOMATION_NAME
    );
  }

  const updateDetails: ESPAutomationUpdateDetails = {
    name,
  };

  const response = await this.update(updateDetails);
  return response;
};
