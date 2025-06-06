/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  MOCK_AUTOMATION,
  MOCK_AUTOMATION_ACTION,
  MOCK_AUTOMATION_RESPONSE,
} from "../helpers/automation/utils";
import {
  updateAutomationActionsMissingActionsTest,
  updateAutomationActionsSuccessTest,
} from "../helpers/automation";
import { ESPRMAPIManager } from "../../src/services/ESPRMAPIManager";

describe("[Unit Test]: Automation - updateActions()", () => {
  test("should update actions successfully", async () => {
    // Mock the authorizeRequest method
    const mockAuthorizeRequest = jest.spyOn(
      ESPRMAPIManager,
      "authorizeRequest"
    );
    mockAuthorizeRequest.mockResolvedValue(
      MOCK_AUTOMATION_RESPONSE.UPDATE_ACTIONS_SUCCESS
    );
    await updateAutomationActionsSuccessTest(MOCK_AUTOMATION, [
      MOCK_AUTOMATION_ACTION,
    ]);
  });

  describe("Error Cases", () => {
    test("should throw error for missing actions while updating automation actions", async () => {
      await updateAutomationActionsMissingActionsTest(MOCK_AUTOMATION);
    });
  });
});
