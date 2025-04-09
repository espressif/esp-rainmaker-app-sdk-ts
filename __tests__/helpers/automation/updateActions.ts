/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPAutomation } from "../../../src/ESPAutomation";
import { StatusMessage } from "../../../src";
import { apiCallValidationErrorMessages } from "../../../src/utils/error/errorMessages";
import { ESPAutomationAction } from "../../../src/types/automation";
import { ESPAPICallValidationError } from "../../../src/utils/error/ESPAPICallValidationError";

// Success test case

/**
 * Helper function to test updating automation actions
 * @param automation - The automation instance
 * @param actions - The actions to update
 */
export async function updateAutomationActionsSuccessTest(
  automation: ESPAutomation,
  actions: ESPAutomationAction[]
) {
  const updatedAutomationResponse = await automation.updateActions(actions);
  expect(updatedAutomationResponse.status).toBe(StatusMessage.SUCCESS);
}

// Error test case

/**
 * Helper function to test updating automation actions with missing actions
 * @param automation - The automation instance
 */
export async function updateAutomationActionsMissingActionsTest(
  automation: ESPAutomation
) {
  try {
    await automation.updateActions([]);
  } catch (error) {
    expect((error as ESPAPICallValidationError).message).toBe(
      apiCallValidationErrorMessages.MISSING_AUTOMATION_ACTIONS
    );
  }
}
