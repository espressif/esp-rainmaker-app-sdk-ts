/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMUser } from "../../../../src/ESPRMUser";
import { ESPAutomation } from "../../../../src/ESPAutomation";
import { apiCallValidationErrorMessages } from "../../../../src/utils/error/errorMessages";
import { ESPAPICallValidationError } from "../../../../src/utils/error/ESPAPICallValidationError";
import { MOCK_INVALID_AUTOMATION_ID } from "../utils";

// Success test case

/**
 * Helper function to test getting automation detail
 * @param user - The user instance
 * @param automationId - The automation ID to fetch
 */
export async function getAutomationDetailSuccessTest(
  user: ESPRMUser,
  automationId: string
) {
  const automation = await user.getAutomationDetail(automationId);
  expect(automation).toBeInstanceOf(ESPAutomation);
}

// Error test cases

/**
 * Helper function to test getting automation detail with missing automation ID
 * @param user - The user instance
 */
export async function getAutomationDetailMissingIdTest(user: ESPRMUser) {
  try {
    await user.getAutomationDetail(MOCK_INVALID_AUTOMATION_ID);
  } catch (error) {
    expect((error as ESPAPICallValidationError).message).toBe(
      apiCallValidationErrorMessages.MISSING_AUTOMATION_ID
    );
  }
}
