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
  disableAutomationSuccessTest,
  enableAutomationSuccessTest,
} from "../helpers/automation";
import { ESPRMAPIManager } from "../../src/services/ESPRMAPIManager";

describe("[Unit Test]: Automation - enable()", () => {
  describe("Success Cases", () => {
    test("should enable automation successfully", async () => {
      // Mock the authorizeRequest method
      const mockAuthorizeRequest = jest.spyOn(
        ESPRMAPIManager,
        "authorizeRequest"
      );
      mockAuthorizeRequest.mockResolvedValue(
        MOCK_AUTOMATION_RESPONSE.ENABLE_AUTOMATION_SUCCESS
      );
      await enableAutomationSuccessTest(MOCK_AUTOMATION);
    });

    test("should disable automation successfully", async () => {
      // Mock the authorizeRequest method
      const mockAuthorizeRequest = jest.spyOn(
        ESPRMAPIManager,
        "authorizeRequest"
      );
      mockAuthorizeRequest.mockResolvedValue(
        MOCK_AUTOMATION_RESPONSE.DISABLE_AUTOMATION_SUCCESS
      );
      await disableAutomationSuccessTest(MOCK_AUTOMATION);
    });
  });
});
