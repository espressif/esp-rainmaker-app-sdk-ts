/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPDevice } from "../../../src/ESPDevice";

/**
 * Helper function to test successful device version info retrieval
 * @param device - The ESPDevice instance
 */
export async function getDeviceVersionInfoSuccessTest(device: ESPDevice) {
  const versionInfo = await device.getDeviceVersionInfo();
  expect(versionInfo).toBeDefined();
  expect(typeof versionInfo).toBe("object");
}

/**
 * Helper function to test device version info with expected results
 * @param device - The ESPDevice instance
 * @param expectedVersionInfo - The expected version info object
 */
export async function getDeviceVersionInfoWithExpectedResultsTest(
  device: ESPDevice,
  expectedVersionInfo: { [key: string]: any }
) {
  const versionInfo = await device.getDeviceVersionInfo();
  expect(versionInfo).toEqual(expectedVersionInfo);
}

/**
 * Helper function to test device version info failure
 * @param device - The ESPDevice instance
 */
export async function getDeviceVersionInfoFailureTest(device: ESPDevice) {
  try {
    await device.getDeviceVersionInfo();
    fail("Expected getDeviceVersionInfo to throw an error");
  } catch (error) {
    expect(error).toBeDefined();
  }
}

/**
 * Helper function to test device version info with empty result
 * @param device - The ESPDevice instance
 */
export async function getDeviceVersionInfoEmptyTest(device: ESPDevice) {
  const versionInfo = await device.getDeviceVersionInfo();
  expect(versionInfo).toEqual({});
}

/**
 * Helper function to test device version info contains specific keys
 * @param device - The ESPDevice instance
 * @param expectedKeys - Array of expected keys in version info
 */
export async function getDeviceVersionInfoContainsKeysTest(
  device: ESPDevice,
  expectedKeys: string[]
) {
  const versionInfo = await device.getDeviceVersionInfo();
  expectedKeys.forEach((key) => {
    expect(versionInfo).toHaveProperty(key);
  });
}
