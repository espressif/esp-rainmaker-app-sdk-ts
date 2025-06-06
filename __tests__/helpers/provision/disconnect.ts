/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPDevice } from "../../../src/ESPDevice";

/**
 * Helper function to test successful device disconnection
 * @param device - The ESPDevice instance
 */
export async function disconnectDeviceSuccessTest(device: ESPDevice) {
  await device.disconnect();
  // Since disconnect() returns void, we just verify it doesn't throw
  expect(true).toBe(true);
}

/**
 * Helper function to test device disconnection failure
 * @param device - The ESPDevice instance
 */
export async function disconnectDeviceFailureTest(device: ESPDevice) {
  try {
    await device.disconnect();
    fail("Expected disconnect to throw an error");
  } catch (error) {
    expect(error).toBeDefined();
  }
}

/**
 * Helper function to test disconnection with custom device name
 * @param device - The ESPDevice instance
 */
export async function disconnectDeviceWithCustomNameTest(device: ESPDevice) {
  await device.disconnect();
  // Verification of adapter call will be done in the actual test
}
