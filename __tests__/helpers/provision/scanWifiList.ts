/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPDevice } from "../../../src/ESPDevice";
import { ESPWifiList } from "../../../src/types/provision";

/**
 * Helper function to test successful WiFi scan
 * @param device - The ESPDevice instance
 */
export async function scanWifiListSuccessTest(device: ESPDevice) {
  const wifiList = await device.scanWifiList();
  expect(Array.isArray(wifiList)).toBe(true);
  expect(wifiList.length).toBeGreaterThan(0);

  // Verify structure of first WiFi item
  if (wifiList.length > 0) {
    const wifi = wifiList[0];
    expect(wifi).toHaveProperty("ssid");
    expect(wifi).toHaveProperty("rssi");
    expect(wifi).toHaveProperty("auth");
    expect(typeof wifi.ssid).toBe("string");
    expect(typeof wifi.rssi).toBe("number");
    expect(typeof wifi.auth).toBe("number");
  }
}

/**
 * Helper function to test WiFi scan with expected results
 * @param device - The ESPDevice instance
 * @param expectedWifiList - The expected WiFi list
 */
export async function scanWifiListWithExpectedResultsTest(
  device: ESPDevice,
  expectedWifiList: ESPWifiList[]
) {
  const wifiList = await device.scanWifiList();
  expect(wifiList).toEqual(expectedWifiList);
}

/**
 * Helper function to test WiFi scan failure
 * @param device - The ESPDevice instance
 */
export async function scanWifiListFailureTest(device: ESPDevice) {
  try {
    await device.scanWifiList();
    fail("Expected scanWifiList to throw an error");
  } catch (error) {
    expect(error).toBeDefined();
  }
}

/**
 * Helper function to test empty WiFi scan results
 * @param device - The ESPDevice instance
 */
export async function scanWifiListEmptyResultsTest(device: ESPDevice) {
  const wifiList = await device.scanWifiList();
  expect(Array.isArray(wifiList)).toBe(true);
  expect(wifiList.length).toBe(0);
}
