/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMBase } from "../../../../src";

/**
 * Helper function to test successful MQTT host retrieval
 * @param expectedHost - The expected MQTT host value
 */
export async function getMQTTHostSuccessTest(expectedHost: string) {
  const result = await ESPRMBase.getMQTTHost();

  expect(result).toBe(expectedHost);
  expect(result).toBeDefined();
  expect(typeof result).toBe("string");
}
