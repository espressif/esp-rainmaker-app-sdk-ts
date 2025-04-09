/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { StatusMessage } from "../../../src";
import { ESPAutomation } from "../../../src/ESPAutomation";
import { apiCallValidationErrorMessages } from "../../../src/utils/error/errorMessages";
import { ESPAPICallValidationError } from "../../../src/utils/error/ESPAPICallValidationError";

// Success test case

/**
 * Helper function to test updating automation name
 * @param automation - The automation instance
 * @param newName - The new name for the automation
 */
export async function updateAutomationNameSuccessTest(
  automation: ESPAutomation,
  newName: string
) {
  const updatedAutomationResponse = await automation.updateName(newName);
  expect(updatedAutomationResponse.status).toBe(StatusMessage.SUCCESS);
}

// Error test case

/**
 * Helper function to test updating automation name with missing name
 * @param automation - The automation instance
 */
export async function updateAutomationNameMissingNameTest(
  automation: ESPAutomation
) {
  try {
    await automation.updateName("");
  } catch (error) {
    expect((error as ESPAPICallValidationError).message).toBe(
      apiCallValidationErrorMessages.MISSING_AUTOMATION_NAME
    );
  }
}
