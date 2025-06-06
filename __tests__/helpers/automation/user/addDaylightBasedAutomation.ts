/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMUser } from "../../../../src/ESPRMUser";
import { ESPAutomation } from "../../../../src/ESPAutomation";
import { ESPDaylightAutomationDetails } from "../../../../src/types/automation";
import { apiCallValidationErrorMessages } from "../../../../src/utils/error/errorMessages";
import { ESPAPICallValidationError } from "../../../../src/utils/error/ESPAPICallValidationError";
import { MOCK_DAYLIGHT_AUTOMATION_DETAILS } from "../utils";

// Success test cases

/**
 * Helper function to test adding daylight-based automation
 * @param user - The user instance
 * @param automationDetails - The automation details to add
 */
export async function addDaylightBasedAutomationSuccessTest(
  user: ESPRMUser,
  automationDetails: ESPDaylightAutomationDetails
) {
  const automation = await user.addDaylightBasedAutomation(automationDetails);
  expect(automation).toBeInstanceOf(ESPAutomation);
}

/**
 * Helper function to test adding daylight-based automation without location
 * This should trigger the getGeoCoordinates call
 * @param user - The user instance
 */
export async function addDaylightBasedAutomationWithoutLocationTest(
  user: ESPRMUser
) {
  // Mock the getGeoCoordinates method to return mock coordinates
  const mockGetGeoCoordinates = jest.spyOn(user, "getGeoCoordinates");
  mockGetGeoCoordinates.mockResolvedValue({
    latitude: "12.9716",
    longitude: "77.5946",
  });

  // Create automation details without location
  const automationDetailsWithoutLocation = {
    ...MOCK_DAYLIGHT_AUTOMATION_DETAILS,
    location: undefined,
  };

  // Call the method
  const automation = await user.addDaylightBasedAutomation(
    automationDetailsWithoutLocation
  );

  // Verify that getGeoCoordinates was called
  expect(mockGetGeoCoordinates).toHaveBeenCalledTimes(1);

  // Verify the result
  expect(automation).toBeInstanceOf(ESPAutomation);
  expect(automation.location).toBeDefined();
  expect(automation.location?.latitude).toBe("12.9716");
  expect(automation.location?.longitude).toBe("77.5946");

  // Restore the original method
  mockGetGeoCoordinates.mockRestore();
}

// Error test cases

/**
 * Helper function to test adding daylight-based automation with missing name
 * @param user - The user instance
 */
export async function addDaylightBasedAutomationMissingNameTest(
  user: ESPRMUser
) {
  const invalidDetails = { ...MOCK_DAYLIGHT_AUTOMATION_DETAILS, name: "" };
  try {
    await user.addDaylightBasedAutomation(invalidDetails);
  } catch (error) {
    expect((error as ESPAPICallValidationError).message).toBe(
      apiCallValidationErrorMessages.MISSING_AUTOMATION_NAME
    );
  }
}

/**
 * Helper function to test adding daylight-based automation with missing events
 * @param user - The user instance
 */
export async function addDaylightBasedAutomationMissingEventsTest(
  user: ESPRMUser
) {
  const invalidDetails = { ...MOCK_DAYLIGHT_AUTOMATION_DETAILS, events: [] };
  try {
    await user.addDaylightBasedAutomation(invalidDetails);
  } catch (error) {
    expect((error as ESPAPICallValidationError).message).toBe(
      apiCallValidationErrorMessages.MISSING_AUTOMATION_EVENTS
    );
  }
}

/**
 * Helper function to test adding daylight-based automation with missing actions
 * @param user - The user instance
 */
export async function addDaylightBasedAutomationMissingActionsTest(
  user: ESPRMUser
) {
  const invalidDetails = { ...MOCK_DAYLIGHT_AUTOMATION_DETAILS, actions: [] };
  try {
    await user.addDaylightBasedAutomation(invalidDetails);
  } catch (error) {
    expect((error as ESPAPICallValidationError).message).toBe(
      apiCallValidationErrorMessages.MISSING_AUTOMATION_ACTIONS
    );
  }
}
