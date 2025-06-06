/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPAutomation } from "../../../src/ESPAutomation";
import { StatusMessage } from "../../../src";

// Success test cases

/**
 * Helper function to test enabling automation
 * @param automation - The automation instance
 */
export async function enableAutomationSuccessTest(automation: ESPAutomation) {
  const enableAutomationResponse = await automation.enable(true);
  expect(enableAutomationResponse.status).toBe(StatusMessage.SUCCESS);
}

/**
 * Helper function to test disabling automation
 * @param automation - The automation instance
 */
export async function disableAutomationSuccessTest(automation: ESPAutomation) {
  const disableAutomationResponse = await automation.enable(false);
  expect(disableAutomationResponse.status).toBe(StatusMessage.SUCCESS);
}
