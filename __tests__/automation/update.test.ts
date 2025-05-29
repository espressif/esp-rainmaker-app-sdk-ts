/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMAPIManager } from "../../src";
import {
  MOCK_AUTOMATION,
  MOCK_DAYLIGHT_AUTOMATION,
  MOCK_WEATHER_AUTOMATION,
  MOCK_AUTOMATION_RESPONSE,
  MOCK_AUTOMATION_UPDATE_DETAILS,
  MOCK_DAYLIGHT_AUTOMATION_UPDATE_DETAILS,
  MOCK_WEATHER_AUTOMATION_UPDATE_DETAILS,
  MOCK_WEATHER_CONDITION_UPDATE_DETAILS,
} from "../helpers/automation/utils";
import {
  updateAutomationMissingIdTest,
  updateAutomationMissingDetailsTest,
  updateAutomationMissingLatitudeTest,
  updateAutomationMissingLongitudeTest,
  updateAutomationSuccessTest,
  updateWeatherAutomationWithConditionStringsTest,
} from "../helpers/automation";

describe("[Unit Test]: Automation - update()", () => {
  describe("Success Cases", () => {
    beforeEach(() => {
      // Mock the authorizeRequest method
      const mockAuthorizeRequest = jest.spyOn(
        ESPRMAPIManager,
        "authorizeRequest"
      );
      mockAuthorizeRequest.mockResolvedValue(
        MOCK_AUTOMATION_RESPONSE.UPDATE_AUTOMATION_SUCCESS
      );
    });

    test("should update NodeParams automation successfully", async () => {
      await updateAutomationSuccessTest(
        MOCK_AUTOMATION,
        MOCK_AUTOMATION_UPDATE_DETAILS
      );
    });

    test("should update Daylight automation successfully", async () => {
      await updateAutomationSuccessTest(
        MOCK_DAYLIGHT_AUTOMATION,
        MOCK_DAYLIGHT_AUTOMATION_UPDATE_DETAILS
      );
    });

    test("should update Weather automation successfully", async () => {
      await updateAutomationSuccessTest(
        MOCK_WEATHER_AUTOMATION,
        MOCK_WEATHER_AUTOMATION_UPDATE_DETAILS
      );
    });

    test("should update Weather automation with condition strings and handle string events", async () => {
      await updateWeatherAutomationWithConditionStringsTest(
        MOCK_WEATHER_AUTOMATION,
        MOCK_WEATHER_CONDITION_UPDATE_DETAILS
      );
    });
  });

  describe("Error Cases", () => {
    test("should throw error for missing automation id while updating automation", async () => {
      await updateAutomationMissingIdTest(MOCK_AUTOMATION);
    });

    test("should throw error for missing automation details while updating automation", async () => {
      await updateAutomationMissingDetailsTest(MOCK_AUTOMATION);
    });

    test("should throw error for missing automation id while updating daylight automation", async () => {
      await updateAutomationMissingIdTest(MOCK_DAYLIGHT_AUTOMATION);
    });

    test("should throw error for missing automation id while updating weather automation", async () => {
      await updateAutomationMissingIdTest(MOCK_WEATHER_AUTOMATION);
    });

    test("should throw error for missing latitude while updating automation", async () => {
      await updateAutomationMissingLatitudeTest(MOCK_AUTOMATION);
    });

    test("should throw error for missing longitude while updating automation", async () => {
      await updateAutomationMissingLongitudeTest(MOCK_AUTOMATION);
    });

    test("should throw error for missing latitude while updating daylight automation", async () => {
      await updateAutomationMissingLatitudeTest(MOCK_DAYLIGHT_AUTOMATION);
    });

    test("should throw error for missing longitude while updating daylight automation", async () => {
      await updateAutomationMissingLongitudeTest(MOCK_DAYLIGHT_AUTOMATION);
    });

    test("should throw error for missing latitude while updating weather automation", async () => {
      await updateAutomationMissingLatitudeTest(MOCK_WEATHER_AUTOMATION);
    });

    test("should throw error for missing longitude while updating weather automation", async () => {
      await updateAutomationMissingLongitudeTest(MOCK_WEATHER_AUTOMATION);
    });
  });
});
