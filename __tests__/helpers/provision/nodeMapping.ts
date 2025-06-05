/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPDevice } from "../../../src/ESPDevice";
import { ESPAPIResponse } from "../../../src/types/output";

/**
 * Helper function to test successful user node mapping initiation
 * @param device - The ESPDevice instance
 */
export async function initiateUserNodeMappingSuccessTest(
  device: ESPDevice,
  requestBody: Record<string, any> = {}
) {
  const result = await device.initiateUserNodeMapping(requestBody);
  expect(result).toBeDefined();
  expect(typeof result).toBe("object");
}

/**
 * Helper function to test user node mapping initiation with custom request body
 * @param device - The ESPDevice instance
 * @param requestBody - The custom request body
 * @param expectedResult - The expected result
 */
export async function initiateUserNodeMappingWithCustomBodyTest(
  device: ESPDevice,
  requestBody: Record<string, any>,
  expectedResult: any
) {
  const result = await device.initiateUserNodeMapping(requestBody);
  expect(result).toEqual(expectedResult);
}

/**
 * Helper function to test user node mapping initiation failure
 * @param device - The ESPDevice instance
 */
export async function initiateUserNodeMappingFailureTest(device: ESPDevice) {
  try {
    await device.initiateUserNodeMapping();
    fail("Expected initiateUserNodeMapping to throw an error");
  } catch (error) {
    expect(error).toBeDefined();
  }
}

/**
 * Helper function to test successful user node mapping verification
 * @param device - The ESPDevice instance
 */
export async function verifyUserNodeMappingSuccessTest(device: ESPDevice) {
  const result = await device.verifyUserNodeMapping();
  expect(result).toBeDefined();
  expect(typeof result).toBe("object");
  expect(result).toHaveProperty("status");
}

/**
 * Helper function to test user node mapping verification with custom request body
 * @param device - The ESPDevice instance
 * @param requestBody - The custom request body
 * @param expectedResult - The expected API response
 */
export async function verifyUserNodeMappingWithCustomBodyTest(
  device: ESPDevice,
  requestBody: Record<string, any>,
  expectedResult: ESPAPIResponse
) {
  const result = await device.verifyUserNodeMapping(requestBody);
  expect(result).toEqual(expectedResult);
}

/**
 * Helper function to test user node mapping verification failure
 * @param device - The ESPDevice instance
 */
export async function verifyUserNodeMappingFailureTest(device: ESPDevice) {
  try {
    await device.verifyUserNodeMapping();
    fail("Expected verifyUserNodeMapping to throw an error");
  } catch (error) {
    expect(error).toBeDefined();
  }
}

/**
 * Helper function to test user node mapping verification returning specific response
 * @param device - The ESPDevice instance
 * @param expectedResponse - The expected ESPAPIResponse
 */
export async function verifyUserNodeMappingWithExpectedResponseTest(
  device: ESPDevice,
  expectedResponse: ESPAPIResponse
) {
  const result = await device.verifyUserNodeMapping();
  expect(result).toEqual(expectedResponse);
}
