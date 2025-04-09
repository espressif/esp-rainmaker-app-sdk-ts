/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPAutomation } from "../../../src/ESPAutomation";
import { ESPAutomationEvent, StatusMessage } from "../../../src";
import { apiCallValidationErrorMessages } from "../../../src/utils/error/errorMessages";
import { ESPAPICallValidationError } from "../../../src/utils/error/ESPAPICallValidationError";

// Success test case

/**
 * Helper function to test updating automation events
 * @param automation - The automation instance
 * @param events - The events to update
 */
export async function updateAutomationEventsSuccessTest(
  automation: ESPAutomation,
  events: ESPAutomationEvent[]
) {
  const updatedAutomationResponse = await automation.updateEvents(events);
  expect(updatedAutomationResponse.status).toBe(StatusMessage.SUCCESS);
}

// Error test case

/**
 * Helper function to test updating automation events with missing events
 * @param automation - The automation instance
 */
export async function updateAutomationEventsMissingEventsTest(
  automation: ESPAutomation
) {
  try {
    await automation.updateEvents([]);
  } catch (error) {
    expect((error as ESPAPICallValidationError).message).toBe(
      apiCallValidationErrorMessages.MISSING_AUTOMATION_EVENTS
    );
  }
}
