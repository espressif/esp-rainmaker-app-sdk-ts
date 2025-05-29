/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  MOCK_AUTOMATION,
  MOCK_AUTOMATION_EVENT,
  MOCK_AUTOMATION_RESPONSE,
} from "../helpers/automation/utils";
import {
  updateAutomationEventsMissingEventsTest,
  updateAutomationEventsSuccessTest,
} from "../helpers/automation";
import { ESPRMAPIManager } from "../../src/services/ESPRMAPIManager";

describe("[Unit Test]: Automation - updateEvents()", () => {
  test("should update events successfully", async () => {
    // Mock the authorizeRequest method
    const mockAuthorizeRequest = jest.spyOn(
      ESPRMAPIManager,
      "authorizeRequest"
    );
    mockAuthorizeRequest.mockResolvedValue(
      MOCK_AUTOMATION_RESPONSE.UPDATE_EVENTS_SUCCESS
    );
    await updateAutomationEventsSuccessTest(MOCK_AUTOMATION, [
      MOCK_AUTOMATION_EVENT,
    ]);
  });

  describe("Error Cases", () => {
    test("should throw error for missing events while updating automation events", async () => {
      await updateAutomationEventsMissingEventsTest(MOCK_AUTOMATION);
    });
  });
});
