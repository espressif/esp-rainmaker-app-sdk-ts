/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPAutomation } from "../../../src/ESPAutomation";
import { StatusMessage } from "../../../src";

// Success test case

/**
 * Helper function to test setting automation retrigger
 * @param automation - The automation instance
 * @param retrigger - The retrigger value
 */
export async function setAutomationRetriggerSuccessTest(
  automation: ESPAutomation,
  retrigger: boolean
) {
  const updatedAutomationResponse = await automation.setRetrigger(retrigger);
  expect(updatedAutomationResponse.status).toBe(StatusMessage.SUCCESS);
}
