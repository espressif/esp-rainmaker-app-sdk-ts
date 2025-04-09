/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  MOCK_AUTOMATION,
  MOCK_AUTOMATION_RESPONSE,
} from "../helpers/automation/utils";
import { setAutomationRetriggerSuccessTest } from "../helpers/automation";
import { ESPRMAPIManager } from "../../src/services/ESPRMAPIManager";

describe("[Unit Test]: Automation - setRetrigger()", () => {
  test("should set retrigger successfully", async () => {
    // Mock the authorizeRequest method
    const mockAuthorizeRequest = jest.spyOn(
      ESPRMAPIManager,
      "authorizeRequest"
    );
    mockAuthorizeRequest.mockResolvedValue(
      MOCK_AUTOMATION_RESPONSE.SET_RETRIGGER_SUCCESS
    );
    await setAutomationRetriggerSuccessTest(MOCK_AUTOMATION, true);
  });
});
