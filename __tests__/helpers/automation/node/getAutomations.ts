/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPAutomation } from "../../../../src/ESPAutomation";
import { ESPRMNode } from "../../../../src/ESPRMNode";

// Success test case

/**
 * Helper function to test getting automations
 * @param node - The node instance
 */
export async function getAutomationsSuccessTest(node: ESPRMNode) {
  const response = await node.getAutomations();
  expect(response).toBeDefined();
  expect(response.automations).toBeDefined();
  expect(Array.isArray(response.automations)).toBe(true);
  if (response.automations.length > 0) {
    expect(response.automations[0]).toBeInstanceOf(ESPAutomation);
  }
  expect(response.hasNext).toBeDefined();
}
