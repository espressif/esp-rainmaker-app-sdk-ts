/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPDevice } from "../../../src/ESPDevice";
import { MOCK_ENDPOINT, MOCK_DATA } from "./utils";

/**
 * Helper function to test successful data sending
 * @param device - The ESPDevice instance
 */
export async function sendDataSuccessTest(
  device: ESPDevice,
  endpoint: string,
  data: string
) {
  const result = await device.sendData(endpoint, data);
  expect(result).toBeDefined();
  expect(typeof result).toBe("string");
}

/**
 * Helper function to test sending data with custom endpoint and data
 * @param device - The ESPDevice instance
 * @param endpoint - The custom endpoint
 * @param data - The custom data
 * @param expectedResult - The expected result
 */
export async function sendDataWithCustomParamsTest(
  device: ESPDevice,
  endpoint: string,
  data: string,
  expectedResult: string
) {
  const result = await device.sendData(endpoint, data);
  expect(result).toBe(expectedResult);
}

/**
 * Helper function to test send data failure
 * @param device - The ESPDevice instance
 */
export async function sendDataFailureTest(device: ESPDevice) {
  try {
    await device.sendData(MOCK_ENDPOINT, MOCK_DATA);
    fail("Expected sendData to throw an error");
  } catch (error) {
    expect(error).toBeDefined();
  }
}

/**
 * Helper function to test sending empty data
 * @param device - The ESPDevice instance
 */
export async function sendDataEmptyTest(device: ESPDevice) {
  const result = await device.sendData(MOCK_ENDPOINT, "");
  expect(typeof result).toBe("string");
}

/**
 * Helper function to test sending data with empty endpoint
 * @param device - The ESPDevice instance
 */
export async function sendDataEmptyEndpointTest(device: ESPDevice) {
  const result = await device.sendData("", MOCK_DATA);
  expect(typeof result).toBe("string");
}
