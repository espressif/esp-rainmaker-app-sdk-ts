/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPDevice } from "../../../src/ESPDevice";
import { MOCK_PROOF_OF_POSSESSION } from "./utils";

/**
 * Helper function to test successful proof of possession setting
 * @param device - The ESPDevice instance
 */
export async function setProofOfPossessionSuccessTest(device: ESPDevice) {
  const result = await device.setProofOfPossession(MOCK_PROOF_OF_POSSESSION);
  expect(typeof result).toBe("boolean");
  expect(result).toBe(true);
}

/**
 * Helper function to test setting proof of possession with custom value
 * @param device - The ESPDevice instance
 * @param proofOfPossession - The custom proof of possession value
 * @param expectedResult - The expected result
 */
export async function setProofOfPossessionWithCustomValueTest(
  device: ESPDevice,
  proofOfPossession: string,
  expectedResult: boolean
) {
  const result = await device.setProofOfPossession(proofOfPossession);
  expect(result).toBe(expectedResult);
}

/**
 * Helper function to test proof of possession setting failure
 * @param device - The ESPDevice instance
 */
export async function setProofOfPossessionFailureTest(device: ESPDevice) {
  try {
    await device.setProofOfPossession(MOCK_PROOF_OF_POSSESSION);
    fail("Expected setProofOfPossession to throw an error");
  } catch (error) {
    expect(error).toBeDefined();
  }
}

/**
 * Helper function to test setting empty proof of possession
 * @param device - The ESPDevice instance
 */
export async function setProofOfPossessionEmptyTest(device: ESPDevice) {
  const result = await device.setProofOfPossession("");
  expect(typeof result).toBe("boolean");
}

/**
 * Helper function to test proof of possession returning false
 * @param device - The ESPDevice instance
 */
export async function setProofOfPossessionReturnsFalseTest(device: ESPDevice) {
  const result = await device.setProofOfPossession(MOCK_PROOF_OF_POSSESSION);
  expect(result).toBe(false);
}
