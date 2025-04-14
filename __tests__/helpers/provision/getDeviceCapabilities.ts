/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPDevice } from "../../../src/ESPDevice";

/**
 * Helper function to test successful device capabilities retrieval
 * @param device - The ESPDevice instance
 */
export async function getDeviceCapabilitiesSuccessTest(device: ESPDevice) {
  const capabilities = await device.getDeviceCapabilities();
  expect(Array.isArray(capabilities)).toBe(true);
  expect(capabilities.length).toBeGreaterThan(0);

  // Verify that all capabilities are strings
  if (capabilities.length > 0) {
    capabilities.forEach((capability) => {
      expect(typeof capability).toBe("string");
    });
  }
}

/**
 * Helper function to test device capabilities with expected results
 * @param device - The ESPDevice instance
 * @param expectedCapabilities - The expected capabilities array
 */
export async function getDeviceCapabilitiesWithExpectedResultsTest(
  device: ESPDevice,
  expectedCapabilities: string[]
) {
  const capabilities = await device.getDeviceCapabilities();
  expect(capabilities).toEqual(expectedCapabilities);
}

/**
 * Helper function to test device capabilities failure
 * @param device - The ESPDevice instance
 */
export async function getDeviceCapabilitiesFailureTest(device: ESPDevice) {
  try {
    await device.getDeviceCapabilities();
    fail("Expected getDeviceCapabilities to throw an error");
  } catch (error) {
    expect(error).toBeDefined();
  }
}

/**
 * Helper function to test empty device capabilities
 * @param device - The ESPDevice instance
 */
export async function getDeviceCapabilitiesEmptyTest(device: ESPDevice) {
  const capabilities = await device.getDeviceCapabilities();
  expect(Array.isArray(capabilities)).toBe(true);
  expect(capabilities.length).toBe(0);
}

/**
 * Helper function to test device capabilities contains specific capability
 * @param device - The ESPDevice instance
 * @param expectedCapability - The capability to check for
 */
export async function getDeviceCapabilitiesContainsTest(
  device: ESPDevice,
  expectedCapability: string
) {
  const capabilities = await device.getDeviceCapabilities();
  expect(capabilities).toContain(expectedCapability);
}
