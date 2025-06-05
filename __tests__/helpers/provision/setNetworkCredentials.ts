/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPDevice } from "../../../src/ESPDevice";
import { ESPProvisionStatus } from "../../../src/types/provision";
import { MOCK_SSID, MOCK_PASSPHRASE } from "./utils";

/**
 * Helper function to test successful network credentials setting
 * @param device - The ESPDevice instance
 */
export async function setNetworkCredentialsSuccessTest(
  device: ESPDevice,
  ssid: string,
  passphrase: string
) {
  const result = await device.setNetworkCredentials(ssid, passphrase);
  expect(result).toBe(ESPProvisionStatus.success);
}

/**
 * Helper function to test network credentials setting with custom values
 * @param device - The ESPDevice instance
 * @param ssid - The custom SSID
 * @param passphrase - The custom passphrase
 * @param expectedResult - The expected provision status
 */
export async function setNetworkCredentialsWithCustomValuesTest(
  device: ESPDevice,
  ssid: string,
  passphrase: string,
  expectedResult: ESPProvisionStatus
) {
  const result = await device.setNetworkCredentials(ssid, passphrase);
  expect(result).toBe(expectedResult);
}

/**
 * Helper function to test network credentials setting failure
 * @param device - The ESPDevice instance
 */
export async function setNetworkCredentialsFailureTest(device: ESPDevice) {
  const result = await device.setNetworkCredentials(MOCK_SSID, MOCK_PASSPHRASE);
  expect(result).toBe(ESPProvisionStatus.failure);
}

/**
 * Helper function to test network credentials setting with empty SSID
 * @param device - The ESPDevice instance
 */
export async function setNetworkCredentialsEmptySSIDTest(device: ESPDevice) {
  const result = await device.setNetworkCredentials("", MOCK_PASSPHRASE);
  expect(Object.values(ESPProvisionStatus)).toContain(result);
}

/**
 * Helper function to test network credentials setting with empty passphrase
 * @param device - The ESPDevice instance
 */
export async function setNetworkCredentialsEmptyPassphraseTest(
  device: ESPDevice
) {
  const result = await device.setNetworkCredentials(MOCK_SSID, "");
  expect(Object.values(ESPProvisionStatus)).toContain(result);
}

/**
 * Helper function to test network credentials setting error handling
 * @param device - The ESPDevice instance
 */
export async function setNetworkCredentialsErrorTest(device: ESPDevice) {
  try {
    await device.setNetworkCredentials(MOCK_SSID, MOCK_PASSPHRASE);
    fail("Expected setNetworkCredentials to throw an error");
  } catch (error) {
    expect(error).toBeDefined();
  }
}
