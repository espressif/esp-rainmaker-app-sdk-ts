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
 * Helper function to test deleting automation
 * @param automation - The automation instance
 */
export async function deleteAutomationSuccessTest(automation: ESPAutomation) {
  const deletedAutomationResponse = await automation.delete();
  expect(deletedAutomationResponse.status).toBe(StatusMessage.SUCCESS);
}

// Error test case

/**
 * Helper function to test deleting automation with missing ID
 * @param automation - The automation instance
 */
export async function deleteAutomationMissingIdTest(automation: ESPAutomation) {
  const originalAutomationId = automation.automationId;
  automation.automationId = "";
  try {
    await automation.delete();
  } catch (error) {
    expect((error as ESPAPICallValidationError).message).toBe(
      apiCallValidationErrorMessages.MISSING_AUTOMATION_ID
    );
  }
  automation.automationId = originalAutomationId;
}
