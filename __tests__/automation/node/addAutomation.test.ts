/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  MOCK_AUTOMATION_DETAILS,
  MOCK_AUTOMATION_RESPONSE,
  MOCK_NODE,
} from "../../helpers/automation/utils";
import {
  addAutomationSuccessTest,
  addAutomationMissingNameTest,
  addAutomationMissingEventsTest,
  addAutomationMissingActionsTest,
} from "../../helpers/automation";
import { ESPRMAPIManager } from "../../../src/services/ESPRMAPIManager";

describe("[Unit Test]: Automation::ESPRMNode - addAutomation()", () => {
  test("should add automation successfully", async () => {
    // Mock the authorizeRequest method
    const mockAuthorizeRequest = jest.spyOn(
      ESPRMAPIManager,
      "authorizeRequest"
    );
    mockAuthorizeRequest.mockResolvedValue(
      MOCK_AUTOMATION_RESPONSE.ADD_AUTOMATION_SUCCESS
    );
    await addAutomationSuccessTest(MOCK_NODE, MOCK_AUTOMATION_DETAILS);
  });

  describe("Error Cases", () => {
    test("should throw error for missing name while adding automation", async () => {
      await addAutomationMissingNameTest(MOCK_NODE);
    });

    test("should throw error for missing events while adding automation", async () => {
      await addAutomationMissingEventsTest(MOCK_NODE);
    });

    test("should throw error for missing actions while adding automation", async () => {
      await addAutomationMissingActionsTest(MOCK_NODE);
    });
  });
});
