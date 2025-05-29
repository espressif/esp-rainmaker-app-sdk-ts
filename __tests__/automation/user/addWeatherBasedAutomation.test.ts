/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMUser } from "../../../src/ESPRMUser";
import {
  setupAutomationTestEnvironment,
  cleanupAutomationTestEnvironment,
  MOCK_WEATHER_AUTOMATION_DETAILS,
  MOCK_AUTOMATION_RESPONSE,
} from "../../helpers/automation/utils";
import {
  addWeatherBasedAutomationSuccessTest,
  addWeatherBasedAutomationWithConditionStringsTest,
  addWeatherBasedAutomationWithoutLocationTest,
  addWeatherBasedAutomationMissingNameTest,
  addWeatherBasedAutomationMissingEventsTest,
  addWeatherBasedAutomationMissingActionsTest,
} from "../../helpers/automation";
import { ESPRMAPIManager } from "../../../src/services/ESPRMAPIManager";

describe("[Unit Test]: Automation::ESPRMUser - addWeatherBasedAutomation()", () => {
  let userInstance: ESPRMUser;

  beforeAll(async () => {
    userInstance = await setupAutomationTestEnvironment();
  });

  test("should add weather-based automation successfully", async () => {
    // Mock the authorizeRequest method
    const mockAuthorizeRequest = jest.spyOn(
      ESPRMAPIManager,
      "authorizeRequest"
    );
    mockAuthorizeRequest.mockResolvedValue(
      MOCK_AUTOMATION_RESPONSE.ADD_AUTOMATION_SUCCESS
    );

    await addWeatherBasedAutomationSuccessTest(
      userInstance,
      MOCK_WEATHER_AUTOMATION_DETAILS
    );
  });

  test("should add weather-based automation with condition strings and handle string events", async () => {
    // Mock the authorizeRequest method
    const mockAuthorizeRequest = jest.spyOn(
      ESPRMAPIManager,
      "authorizeRequest"
    );
    mockAuthorizeRequest.mockResolvedValue(
      MOCK_AUTOMATION_RESPONSE.ADD_AUTOMATION_SUCCESS
    );

    await addWeatherBasedAutomationWithConditionStringsTest(userInstance);
  });

  test("should add weather-based automation without location by calling getGeoCoordinates internally", async () => {
    // Mock the authorizeRequest method
    const mockAuthorizeRequest = jest.spyOn(
      ESPRMAPIManager,
      "authorizeRequest"
    );
    mockAuthorizeRequest.mockResolvedValue(
      MOCK_AUTOMATION_RESPONSE.ADD_AUTOMATION_SUCCESS
    );

    await addWeatherBasedAutomationWithoutLocationTest(userInstance);
  });

  describe("Error Cases", () => {
    test("should throw error for missing name while adding weather-based automation", async () => {
      await addWeatherBasedAutomationMissingNameTest(userInstance);
    });

    test("should throw error for missing events while adding weather-based automation", async () => {
      await addWeatherBasedAutomationMissingEventsTest(userInstance);
    });

    test("should throw error for missing actions while adding weather-based automation", async () => {
      await addWeatherBasedAutomationMissingActionsTest(userInstance);
    });
  });

  afterAll(async () => {
    await cleanupAutomationTestEnvironment(userInstance);
  });
});
