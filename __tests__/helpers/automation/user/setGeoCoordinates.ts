/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { StatusMessage } from "../../../../src";
import { ESPRMUser } from "../../../../src/ESPRMUser";
import { ESPGeoCoordinates } from "../../../../src/types/automation";
import { apiCallValidationErrorMessages } from "../../../../src/utils/error/errorMessages";
import { ESPAPICallValidationError } from "../../../../src/utils/error/ESPAPICallValidationError";
import { MOCK_GEO_COORDINATES } from "../utils";

// Success test case

/**
 * Helper function to test setting geo coordinates
 * @param user - The user instance
 * @param coordinates - The coordinates to set
 */
export async function setGeoCoordinatesSuccessTest(
  user: ESPRMUser,
  coordinates: ESPGeoCoordinates
) {
  const response = await user.setGeoCoordinates(coordinates);
  expect(response).toBeDefined();
  expect(response.status).toBe(StatusMessage.SUCCESS);
}

// Error test cases

/**
 * Helper function to test setting geo coordinates with missing latitude
 * @param user - The user instance
 */
export async function setGeoCoordinatesMissingLatitudeTest(user: ESPRMUser) {
  try {
    await user.setGeoCoordinates({
      ...MOCK_GEO_COORDINATES,
      latitude: "",
    });
  } catch (error) {
    expect((error as ESPAPICallValidationError).message).toBe(
      apiCallValidationErrorMessages.MISSING_LATITUDE
    );
  }
}

/**
 * Helper function to test setting geo coordinates with missing longitude
 * @param user - The user instance
 */
export async function setGeoCoordinatesMissingLongitudeTest(user: ESPRMUser) {
  try {
    await user.setGeoCoordinates({
      ...MOCK_GEO_COORDINATES,
      longitude: "",
    });
  } catch (error) {
    expect((error as ESPAPICallValidationError).message).toBe(
      apiCallValidationErrorMessages.MISSING_LONGITUDE
    );
  }
}
