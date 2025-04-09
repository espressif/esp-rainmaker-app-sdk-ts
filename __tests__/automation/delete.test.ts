/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  MOCK_AUTOMATION,
  MOCK_AUTOMATION_RESPONSE,
} from "../helpers/automation/utils";
import {
  deleteAutomationMissingIdTest,
  deleteAutomationSuccessTest,
} from "../helpers/automation";
import { ESPRMAPIManager } from "../../src/services/ESPRMAPIManager";

describe("[Unit Test]: Automation - delete()", () => {
  test("should delete automation successfully", async () => {
    // Mock the authorizeRequest method
    const mockAuthorizeRequest = jest.spyOn(
      ESPRMAPIManager,
      "authorizeRequest"
    );
    mockAuthorizeRequest.mockResolvedValue(
      MOCK_AUTOMATION_RESPONSE.DELETE_AUTOMATION_SUCCESS
    );
    await deleteAutomationSuccessTest(MOCK_AUTOMATION);
  });

  describe("Error Cases", () => {
    test("should throw error for missing automation id while deleting automation", async () => {
      await deleteAutomationMissingIdTest(MOCK_AUTOMATION);
    });
  });
});
