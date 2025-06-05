/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPDevice } from "../../../src/ESPDevice";
import {
  ESPProvResponse,
  ESPProvResponseStatus,
} from "../../../src/types/provision";
import { ProvErrorCodes } from "../../../src/utils/constants";
import { ESPProvError } from "../../../src/utils/error/Error";
import {
  MOCK_SSID,
  MOCK_PASSPHRASE,
  mockProgressCallback,
  verifyProvisionProgressCalls,
} from "./utils";

/**
 * Helper function to test successful device provisioning
 * @param device - The ESPDevice instance
 */
export async function provisionDeviceSuccessTest(device: ESPDevice) {
  await device.provision(MOCK_SSID, MOCK_PASSPHRASE, mockProgressCallback);

  // Verify that progress callbacks were called
  expect(mockProgressCallback).toHaveBeenCalled();

  // Check that the final callback indicates success
  const lastCall =
    mockProgressCallback.mock.calls[
      mockProgressCallback.mock.calls.length - 1
    ][0];
  expect(lastCall.status).toBe(ESPProvResponseStatus.succeed);
}

/**
 * Helper function to test provisioning with missing SSID
 * @param device - The ESPDevice instance
 */
export async function provisionDeviceMissingSSIDTest(device: ESPDevice) {
  try {
    await device.provision("", MOCK_PASSPHRASE, mockProgressCallback);
    fail("Expected provision to throw an error for missing SSID");
  } catch (error) {
    expect(error).toBeDefined();
  }
}

/**
 * Helper function to test provisioning with missing passphrase
 * @param device - The ESPDevice instance
 */
export async function provisionDeviceMissingPassphraseTest(device: ESPDevice) {
  try {
    await device.provision(MOCK_SSID, "", mockProgressCallback);
    fail("Expected provision to throw an error for missing passphrase");
  } catch (error) {
    expect(error).toBeDefined();
  }
}

/**
 * Helper function to test provisioning failure due to network timeout
 * @param device - The ESPDevice instance
 */
export async function provisionDeviceNetworkTimeoutTest(device: ESPDevice) {
  try {
    await device.provision(MOCK_SSID, MOCK_PASSPHRASE, mockProgressCallback);
    fail("Expected provision to throw a timeout error");
  } catch (error) {
    expect(error).toBeInstanceOf(ESPProvError);
    expect((error as ESPProvError).code).toBe(
      ProvErrorCodes.FAILED_USER_NODE_MAPPING_CLOUD_TIMEOUT
    );
  }
}

/**
 * Helper function to test provisioning failure due to node mapping request creation
 * @param device - The ESPDevice instance
 */
export async function provisionDeviceNodeMappingFailureTest(device: ESPDevice) {
  try {
    await device.provision(MOCK_SSID, MOCK_PASSPHRASE, mockProgressCallback);
    fail("Expected provision to throw a node mapping error");
  } catch (error) {
    expect(error).toBeInstanceOf(ESPProvError);
    expect((error as ESPProvError).code).toBe(
      ProvErrorCodes.FAILED_USER_NODE_MAPPING_REQUEST_CREATION
    );
  }
}

/**
 * Helper function to test provisioning with custom progress tracking
 * @param device - The ESPDevice instance
 * @param expectedProgressCalls - Expected progress callback calls
 */
export async function provisionDeviceWithProgressTest(
  device: ESPDevice,
  expectedProgressCalls: ESPProvResponse[]
) {
  await device.provision(MOCK_SSID, MOCK_PASSPHRASE, mockProgressCallback);
  verifyProvisionProgressCalls(expectedProgressCalls);
}
