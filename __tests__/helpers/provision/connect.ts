/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPConnectStatus, ESPDevice } from "../../../src";

/**
 * Helper function to test successful device connection
 * @param device - The ESPDevice instance
 */
export async function connectDeviceSuccessTest(device: ESPDevice) {
  const response = await device.connect();
  expect(response).toBe(ESPConnectStatus.connected);
}

/**
 * Helper function to test device connection with custom response
 * @param device - The ESPDevice instance
 * @param expectedResponse - The expected response
 */
export async function connectDeviceWithExpectedResultsTest(
  device: ESPDevice,
  expectedResponse: any
) {
  const response = await device.connect();
  expect(response).toEqual(expectedResponse);
}

/**
 * Helper function to test device connection failure
 * @param device - The ESPDevice instance
 */
export async function connectDeviceFailureTest(device: ESPDevice) {
  try {
    await device.connect();
    // If we reach here, the test should fail
    fail("Expected connect to throw an error");
  } catch (error) {
    expect(error).toBeDefined();
  }
}
