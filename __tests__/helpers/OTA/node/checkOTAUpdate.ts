/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMNode } from "../../../../src/index";

// Success test case

/**
 * Helper function to test successful OTA update check
 * @param node - The ESPRMNode instance to test with
 */
export const checkOTAUpdateSuccessTest = async (node: ESPRMNode) => {
  const otaUpdateResponse = await node.checkOTAUpdate();

  // Verify response structure
  expect(otaUpdateResponse).toBeDefined();
  expect(otaUpdateResponse.status).toBeDefined();
  expect(otaUpdateResponse.otaAvailable).toBeDefined();
  expect(typeof otaUpdateResponse.otaAvailable).toBe("boolean");
};
