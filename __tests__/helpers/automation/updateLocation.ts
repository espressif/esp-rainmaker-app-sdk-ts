/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPAutomation } from "../../../src/ESPAutomation";
import { StatusMessage } from "../../../src/utils/constants";
import { ESPGeoCoordinates } from "../../../src/types/automation";
import { apiCallValidationErrorMessages } from "../../../src/utils/error/errorMessages";
import { ESPAPICallValidationError } from "../../../src/utils/error/ESPAPICallValidationError";

// Success test case

/**
 * Helper function to test updating automation location
 * @param automation - The automation instance
 * @param location - The location to update
 */
export async function updateAutomationLocationSuccessTest(
  automation: ESPAutomation,
  location: ESPGeoCoordinates
) {
  const updatedAutomationResponse = await automation.updateLocation(location);
  expect(updatedAutomationResponse.status).toBe(StatusMessage.SUCCESS);
}

// Error test case

/**
 * Helper function to test updating automation location with missing latitude
 * @param automation - The automation instance
 */
export async function updateAutomationLocationMissingLatitudeTest(
  automation: ESPAutomation
) {
  try {
    const newLocationWithoutLatitude = {
      longitude: "12.9716",
    } as unknown as ESPGeoCoordinates;
    await automation.updateLocation(newLocationWithoutLatitude);
  } catch (error) {
    expect((error as ESPAPICallValidationError).message).toBe(
      apiCallValidationErrorMessages.MISSING_LATITUDE
    );
  }
}

/**
 * Helper function to test updating automation location with missing longitude
 * @param automation - The automation instance
 */
export async function updateAutomationLocationMissingLongitudeTest(
  automation: ESPAutomation
) {
  try {
    const newLocationWithoutLongitude = {
      latitude: "12.9716",
    } as unknown as ESPGeoCoordinates;
    await automation.updateLocation(newLocationWithoutLongitude);
  } catch (error) {
    expect((error as ESPAPICallValidationError).message).toBe(
      apiCallValidationErrorMessages.MISSING_LONGITUDE
    );
  }
}
