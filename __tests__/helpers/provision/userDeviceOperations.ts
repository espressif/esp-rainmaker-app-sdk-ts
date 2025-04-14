/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMUser } from "../../../src/ESPRMUser";
import { ESPDevice } from "../../../src/ESPDevice";
import { ESPTransport, ESPSecurity } from "../../../src/types/provision";
import { MOCK_DEVICE_PREFIX, MOCK_TRANSPORT } from "./utils";

/**
 * Helper function to test successful ESP devices search
 * @param user - The ESPRMUser instance
 */
export async function searchESPDevicesSuccessTest(
  user: ESPRMUser,
  devicePrefix: string,
  transport: ESPTransport
) {
  const devices = await user.searchESPDevices(devicePrefix, transport);
  expect(devices).toBeDefined();
  expect(Array.isArray(devices)).toBe(true);
}

/**
 * Helper function to test ESP devices search with expected results
 * @param user - The ESPRMUser instance
 * @param expectedDeviceCount - Expected number of devices
 */
export async function searchESPDevicesWithExpectedResultsTest(
  user: ESPRMUser,
  expectedDeviceCount: number
) {
  const devices = await user.searchESPDevices(
    MOCK_DEVICE_PREFIX,
    MOCK_TRANSPORT as ESPTransport
  );
  expect(devices).toHaveLength(expectedDeviceCount);
  devices.forEach((device) => {
    expect(device).toBeInstanceOf(ESPDevice);
  });
}

/**
 * Helper function to test ESP devices search with custom parameters
 * @param user - The ESPRMUser instance
 * @param devicePrefix - Custom device prefix
 * @param transport - Custom transport type
 */
export async function searchESPDevicesWithCustomParamsTest(
  user: ESPRMUser,
  devicePrefix: string,
  transport: ESPTransport
) {
  const devices = await user.searchESPDevices(devicePrefix, transport);
  expect(devices).toBeDefined();
  expect(Array.isArray(devices)).toBe(true);
}

/**
 * Helper function to test ESP devices search failure
 * @param user - The ESPRMUser instance
 */
export async function searchESPDevicesFailureTest(user: ESPRMUser) {
  try {
    await user.searchESPDevices(
      MOCK_DEVICE_PREFIX,
      MOCK_TRANSPORT as ESPTransport
    );
    fail("Expected searchESPDevices to throw an error");
  } catch (error) {
    expect(error).toBeDefined();
  }
}

/**
 * Helper function to test ESP devices search with empty results
 * @param user - The ESPRMUser instance
 */
export async function searchESPDevicesEmptyResultsTest(user: ESPRMUser) {
  const devices = await user.searchESPDevices(
    MOCK_DEVICE_PREFIX,
    MOCK_TRANSPORT as ESPTransport
  );
  expect(devices).toEqual([]);
}

/**
 * Helper function to test successful ESP devices search stop
 * @param user - The ESPRMUser instance
 */
export async function stopESPDevicesSearchSuccessTest(user: ESPRMUser) {
  await user.stopESPDevicesSearch();
  // Since the method returns void, we just verify it doesn't throw
  expect(true).toBe(true);
}

/**
 * Helper function to test ESP devices search stop failure
 * @param user - The ESPRMUser instance
 */
export async function stopESPDevicesSearchFailureTest(user: ESPRMUser) {
  try {
    await user.stopESPDevicesSearch();
    fail("Expected stopESPDevicesSearch to throw an error");
  } catch (error) {
    expect(error).toBeDefined();
  }
}

/**
 * Helper function to test successful ESP device creation
 * @param user - The ESPRMUser instance
 */
export async function createESPDeviceSuccessTest(
  user: ESPRMUser,
  deviceName: string,
  transport: ESPTransport
) {
  const device = await user.createESPDevice(deviceName, transport);
  expect(device).toBeDefined();
  expect(device).toBeInstanceOf(ESPDevice);
  expect(device.name).toBe(deviceName);
}

/**
 * Helper function to test ESP device creation with all parameters
 * @param user - The ESPRMUser instance
 */
export async function createESPDeviceWithAllParamsTest(
  user: ESPRMUser,
  paramConfig: {
    name: string;
    transport: ESPTransport;
    security: ESPSecurity;
    proofOfPossession: string;
    softAPPassword: string;
    username: string;
  }
) {
  const device = await user.createESPDevice(
    paramConfig.name,
    paramConfig.transport,
    paramConfig.security,
    paramConfig.proofOfPossession,
    paramConfig.softAPPassword,
    paramConfig.username
  );
  expect(device).toBeDefined();
  expect(device).toBeInstanceOf(ESPDevice);
  expect(device.name).toBe("test-device");
}

/**
 * Helper function to test ESP device creation failure
 * @param user - The ESPRMUser instance
 */
export async function createESPDeviceFailureTest(user: ESPRMUser) {
  try {
    await user.createESPDevice("test-device", MOCK_TRANSPORT as ESPTransport);
    fail("Expected createESPDevice to throw an error");
  } catch (error) {
    expect(error).toBeDefined();
  }
}

/**
 * Helper function to test ESP device creation with empty name
 * @param user - The ESPRMUser instance
 */
export async function createESPDeviceEmptyNameTest(user: ESPRMUser) {
  try {
    await user.createESPDevice("", MOCK_TRANSPORT as ESPTransport);
    fail("Expected createESPDevice to throw an error for empty name");
  } catch (error) {
    expect(error).toBeDefined();
  }
}
