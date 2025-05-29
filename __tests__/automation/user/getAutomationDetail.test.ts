/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMUser } from "../../../src/ESPRMUser";
import {
  setupAutomationTestEnvironment,
  cleanupAutomationTestEnvironment,
  MOCK_AUTOMATION_ID,
  MOCK_AUTOMATION_RESPONSE,
} from "../../helpers/automation/utils";
import {
  getAutomationDetailSuccessTest,
  getAutomationDetailMissingIdTest,
} from "../../helpers/automation";
import { ESPRMAPIManager } from "../../../src/services/ESPRMAPIManager";

describe("[Unit Test]: Automation::ESPRMUser - getAutomationDetail()", () => {
  let userInstance: ESPRMUser;

  beforeAll(async () => {
    userInstance = await setupAutomationTestEnvironment();
  });

  test("should get automation detail successfully", async () => {
    // Mock the authorizeRequest method
    const mockAuthorizeRequest = jest.spyOn(
      ESPRMAPIManager,
      "authorizeRequest"
    );
    mockAuthorizeRequest.mockResolvedValue(
      MOCK_AUTOMATION_RESPONSE.GET_AUTOMATION_DETAIL_SUCCESS
    );
    await getAutomationDetailSuccessTest(userInstance, MOCK_AUTOMATION_ID);
  });

  describe("Error Cases", () => {
    test("should throw error for missing automation ID", async () => {
      await getAutomationDetailMissingIdTest(userInstance);
    });
  });

  afterAll(async () => {
    await cleanupAutomationTestEnvironment(userInstance);
  });
});
