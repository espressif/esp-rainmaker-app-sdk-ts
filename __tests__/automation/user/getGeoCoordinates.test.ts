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
import {
  getGeoCoordinatesSuccessTest,
  getGeoCoordinatesMissingTest,
  getGeoCoordinatesInvalidTest,
} from "../../helpers/automation";
import { ESPRMAPIManager } from "../../../src/services/ESPRMAPIManager";

describe("[Unit Test]: Automation::ESPRMUser - getGeoCoordinates()", () => {
  let userInstance: ESPRMUser;

  beforeAll(async () => {
    userInstance = await setupAutomationTestEnvironment();
  });

  test("should get geo coordinates successfully", async () => {
    // Mock the authorizeRequest method
    const mockAuthorizeRequest = jest.spyOn(
      ESPRMAPIManager,
      "authorizeRequest"
    );
    mockAuthorizeRequest.mockResolvedValue(
      MOCK_AUTOMATION_RESPONSE.GET_GEO_COORDINATES_SUCCESS
    );
    await getGeoCoordinatesSuccessTest(userInstance);
  });

  describe("Error Cases", () => {
    test("should throw error when geo coordinates are missing from custom data", async () => {
      await getGeoCoordinatesMissingTest(userInstance);
    });

    test("should throw error when geo coordinates are invalid", async () => {
      await getGeoCoordinatesInvalidTest(userInstance);
    });
  });

  afterAll(async () => {
    await cleanupAutomationTestEnvironment(userInstance);
  });
});
