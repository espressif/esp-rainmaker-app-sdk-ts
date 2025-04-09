/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMUser } from "../../../src/ESPRMUser";
import {
  setupAutomationTestEnvironment,
  cleanupAutomationTestEnvironment,
  MOCK_DAYLIGHT_AUTOMATION_DETAILS,
  MOCK_AUTOMATION_RESPONSE,
} from "../../helpers/automation/utils";
import {
  addDaylightBasedAutomationSuccessTest,
  addDaylightBasedAutomationWithoutLocationTest,
  addDaylightBasedAutomationMissingNameTest,
  addDaylightBasedAutomationMissingEventsTest,
  addDaylightBasedAutomationMissingActionsTest,
} from "../../helpers/automation";
import { ESPRMAPIManager } from "../../../src/services/ESPRMAPIManager";

describe("[Unit Test]: Automation::ESPRMUser - addDaylightBasedAutomation()", () => {
  let userInstance: ESPRMUser;

  beforeAll(async () => {
    userInstance = await setupAutomationTestEnvironment();
  });

  test("should add daylight-based automation successfully", async () => {
    // Mock the authorizeRequest method
    const mockAuthorizeRequest = jest.spyOn(
      ESPRMAPIManager,
      "authorizeRequest"
    );
    mockAuthorizeRequest.mockResolvedValue(
      MOCK_AUTOMATION_RESPONSE.ADD_AUTOMATION_SUCCESS
    );

    await addDaylightBasedAutomationSuccessTest(
      userInstance,
      MOCK_DAYLIGHT_AUTOMATION_DETAILS
    );
  });

  test("should add daylight-based automation without location by calling getGeoCoordinates internally", async () => {
    // Mock the authorizeRequest method
    const mockAuthorizeRequest = jest.spyOn(
      ESPRMAPIManager,
      "authorizeRequest"
    );
    mockAuthorizeRequest.mockResolvedValue(
      MOCK_AUTOMATION_RESPONSE.ADD_AUTOMATION_SUCCESS
    );

    await addDaylightBasedAutomationWithoutLocationTest(userInstance);
  });

  describe("Error Cases", () => {
    test("should throw error for missing name while adding daylight-based automation", async () => {
      await addDaylightBasedAutomationMissingNameTest(userInstance);
    });

    test("should throw error for missing events while adding daylight-based automation", async () => {
      await addDaylightBasedAutomationMissingEventsTest(userInstance);
    });

    test("should throw error for missing actions while adding daylight-based automation", async () => {
      await addDaylightBasedAutomationMissingActionsTest(userInstance);
    });
  });

  afterAll(async () => {
    await cleanupAutomationTestEnvironment(userInstance);
  });
});
