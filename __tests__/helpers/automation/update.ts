/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPAutomation } from "../../../src/ESPAutomation";
import { ESPAutomationUpdateDetails, StatusMessage } from "../../../src";
import { apiCallValidationErrorMessages } from "../../../src/utils/error/errorMessages";
import { ESPAPICallValidationError } from "../../../src/utils/error/ESPAPICallValidationError";

// Success test cases

/**
 * Helper function to test updating automation
 * @param automation - The automation instance
 * @param automationDetails - The automation details to update
 */
export async function updateAutomationSuccessTest(
  automation: ESPAutomation,
  automationDetails: ESPAutomationUpdateDetails
) {
  const updatedAutomationResponse = await automation.update(automationDetails);
  expect(updatedAutomationResponse.status).toBe(StatusMessage.SUCCESS);
}

/**
 * Helper function to test updating weather automation with condition strings
 * This should trigger the string handling code path in the events mapping
 * @param automation - The weather automation instance
 * @param automationDetails - The automation details with string events
 */
export async function updateWeatherAutomationWithConditionStringsTest(
  automation: ESPAutomation,
  automationDetails: ESPAutomationUpdateDetails
) {
  const updatedAutomationResponse = await automation.update(automationDetails);
  expect(updatedAutomationResponse.status).toBe(StatusMessage.SUCCESS);
}

// Error test cases

/**
 * Helper function to test updating automation with missing ID
 * @param automation - The automation instance
 */
export async function updateAutomationMissingIdTest(automation: ESPAutomation) {
  const originalAutomationId = automation.automationId;
  automation.automationId = "";
  try {
    await automation.update({});
  } catch (error) {
    expect((error as ESPAPICallValidationError).message).toBe(
      apiCallValidationErrorMessages.MISSING_AUTOMATION_ID
    );
  }
  automation.automationId = originalAutomationId;
}

/**
 * Helper function to test updating automation with missing details
 * @param automation - The automation instance
 */
export async function updateAutomationMissingDetailsTest(
  automation: ESPAutomation
) {
  try {
    await automation.update({});
  } catch (error) {
    expect((error as ESPAPICallValidationError).message).toBe(
      apiCallValidationErrorMessages.MISSING_AUTOMATION_UPDATE_DETAILS
    );
  }
}

/**
 * Helper function to test updating automation with missing latitude
 * @param automation - The automation instance
 */
export async function updateAutomationMissingLatitudeTest(
  automation: ESPAutomation
) {
  const updateDetails: ESPAutomationUpdateDetails = {
    name: "Test Update",
    location: {
      latitude: "", // Empty latitude
      longitude: "77.5946",
    },
  };

  try {
    await automation.update(updateDetails);
  } catch (error) {
    expect((error as ESPAPICallValidationError).message).toBe(
      apiCallValidationErrorMessages.MISSING_LATITUDE
    );
  }
}

/**
 * Helper function to test updating automation with missing longitude
 * @param automation - The automation instance
 */
export async function updateAutomationMissingLongitudeTest(
  automation: ESPAutomation
) {
  const updateDetails: ESPAutomationUpdateDetails = {
    name: "Test Update",
    location: {
      latitude: "12.9716",
      longitude: "", // Empty longitude
    },
  };

  try {
    await automation.update(updateDetails);
  } catch (error) {
    expect((error as ESPAPICallValidationError).message).toBe(
      apiCallValidationErrorMessages.MISSING_LONGITUDE
    );
  }
}
