/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMUser } from "../../../../src/ESPRMUser";
import { apiCallValidationErrorMessages } from "../../../../src/utils/error/errorMessages";
import { ESPAPICallValidationError } from "../../../../src/utils/error/ESPAPICallValidationError";
import { Keys } from "../../../../src/utils/constants";

// Success test case

/**
 * Helper function to test getting geo coordinates
 * @param user - The user instance
 */
export async function getGeoCoordinatesSuccessTest(user: ESPRMUser) {
  const coordinates = await user.getGeoCoordinates();
  expect(coordinates).toBeDefined();
  expect(coordinates.latitude).toBeDefined();
  expect(coordinates.longitude).toBeDefined();
  expect(typeof coordinates.latitude).toBe("string");
  expect(typeof coordinates.longitude).toBe("string");
}

// Error test cases

/**
 * Helper function to test getting geo coordinates when they are missing from custom data
 * @param user - The user instance
 */
export async function getGeoCoordinatesMissingTest(user: ESPRMUser) {
  // Mock the getCustomData to return empty coordinates
  jest.spyOn(user, "getCustomData").mockResolvedValue({});

  try {
    await user.getGeoCoordinates();
  } catch (error) {
    expect((error as ESPAPICallValidationError).message).toBe(
      apiCallValidationErrorMessages.MISSING_GEO_COORDINATES
    );
  }
}

/**
 * Helper function to test getting geo coordinates when they are invalid
 * @param user - The user instance
 */
export async function getGeoCoordinatesInvalidTest(user: ESPRMUser) {
  // Mock the getCustomData to return invalid coordinates
  jest.spyOn(user, "getCustomData").mockResolvedValue({
    [Keys.GEO_COORDINATES]: {
      value: {
        latitude: "",
        longitude: "",
      },
    },
  });

  try {
    await user.getGeoCoordinates();
  } catch (error) {
    expect((error as ESPAPICallValidationError).message).toBe(
      apiCallValidationErrorMessages.INVALID_GEO_COORDINATES
    );
  }
}
