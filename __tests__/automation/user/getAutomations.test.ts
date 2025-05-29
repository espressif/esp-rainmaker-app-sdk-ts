/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMUser } from "../../../src/ESPRMUser";
import {
  setupAutomationTestEnvironment,
  cleanupAutomationTestEnvironment,
  MOCK_AUTOMATION_RESPONSE,
} from "../../helpers/automation/utils";
import { getUserAutomationsSuccessTest } from "../../helpers/automation";
import { ESPRMAPIManager } from "../../../src/services/ESPRMAPIManager";

describe("[Unit Test]: Automation::ESPRMUser - getAutomations()", () => {
  let userInstance: ESPRMUser;

  beforeAll(async () => {
    userInstance = await setupAutomationTestEnvironment();
  });

  test("should get user's automations successfully", async () => {
    // Mock the authorizeRequest method
    const mockAuthorizeRequest = jest.spyOn(
      ESPRMAPIManager,
      "authorizeRequest"
    );
    mockAuthorizeRequest.mockResolvedValue(
      MOCK_AUTOMATION_RESPONSE.GET_AUTOMATIONS_SUCCESS
    );
    await getUserAutomationsSuccessTest(userInstance);
  });

  afterAll(async () => {
    await cleanupAutomationTestEnvironment(userInstance);
  });
});
