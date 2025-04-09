/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  MOCK_NODE,
  MOCK_AUTOMATION_RESPONSE,
} from "../../helpers/automation/utils";
import { getAutomationsSuccessTest } from "../../helpers/automation";
import { ESPRMAPIManager } from "../../../src/services/ESPRMAPIManager";

describe("[Unit Test]: Automation::ESPRMNode - getAutomations()", () => {
  test("should get node's automations successfully", async () => {
    // Mock the authorizeRequest method
    const mockAuthorizeRequest = jest.spyOn(
      ESPRMAPIManager,
      "authorizeRequest"
    );
    mockAuthorizeRequest.mockResolvedValue(
      MOCK_AUTOMATION_RESPONSE.GET_AUTOMATIONS_SUCCESS
    );
    await getAutomationsSuccessTest(MOCK_NODE);
  });
});
