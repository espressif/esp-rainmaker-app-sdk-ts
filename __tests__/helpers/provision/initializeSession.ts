/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPDevice } from "../../../src/ESPDevice";

/**
 * Helper function to test successful session initialization
 * @param device - The ESPDevice instance
 */
export async function initializeSessionSuccessTest(device: ESPDevice) {
  const result = await device.initializeSession();
  expect(typeof result).toBe("boolean");
  expect(result).toBe(true);
}

/**
 * Helper function to test session initialization returning false
 * @param device - The ESPDevice instance
 */
export async function initializeSessionReturnsFalseTest(device: ESPDevice) {
  const result = await device.initializeSession();
  expect(typeof result).toBe("boolean");
  expect(result).toBe(false);
}

/**
 * Helper function to test session initialization failure
 * @param device - The ESPDevice instance
 */
export async function initializeSessionFailureTest(device: ESPDevice) {
  try {
    await device.initializeSession();
    fail("Expected initializeSession to throw an error");
  } catch (error) {
    expect(error).toBeDefined();
  }
}

/**
 * Helper function to test session initialization with custom result
 * @param device - The ESPDevice instance
 * @param expectedResult - The expected boolean result
 */
export async function initializeSessionWithExpectedResultTest(
  device: ESPDevice,
  expectedResult: boolean
) {
  const result = await device.initializeSession();
  expect(result).toBe(expectedResult);
}
