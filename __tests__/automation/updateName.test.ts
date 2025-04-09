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
  updateAutomationNameMissingNameTest,
  updateAutomationNameSuccessTest,
} from "../helpers/automation";
import { ESPRMAPIManager } from "../../src/services/ESPRMAPIManager";

describe("[Unit Test]: Automation - updateName()", () => {
  test("should update name successfully", async () => {
    // Mock the authorizeRequest method
    const mockAuthorizeRequest = jest.spyOn(
      ESPRMAPIManager,
      "authorizeRequest"
    );
    mockAuthorizeRequest.mockResolvedValue(
      MOCK_AUTOMATION_RESPONSE.UPDATE_NAME_SUCCESS
    );
    await updateAutomationNameSuccessTest(MOCK_AUTOMATION, "test");
  });

  describe("Error Cases", () => {
    test("should throw error for missing name while updating automation name", async () => {
      await updateAutomationNameMissingNameTest(MOCK_AUTOMATION);
    });
  });
});
