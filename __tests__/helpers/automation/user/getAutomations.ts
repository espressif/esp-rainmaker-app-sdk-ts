/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPAutomation } from "../../../../src/ESPAutomation";
import { ESPRMUser } from "../../../../src/ESPRMUser";

// Success test case

/**
 * Helper function to test getting all automations for a user
 * @param user - The user instance
 */
export async function getUserAutomationsSuccessTest(user: ESPRMUser) {
  const response = await user.getAutomations();
  expect(response).toBeDefined();
  expect(response.automations).toBeDefined();
  expect(Array.isArray(response.automations)).toBe(true);
  if (response.automations.length > 0) {
    expect(response.automations[0]).toBeInstanceOf(ESPAutomation);
  }
  expect(response.hasNext).toBeDefined();
}
