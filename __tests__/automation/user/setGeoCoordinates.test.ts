/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMUser } from "../../../src/ESPRMUser";
import {
  setupAutomationTestEnvironment,
  cleanupAutomationTestEnvironment,
  MOCK_GEO_COORDINATES,
  MOCK_AUTOMATION_RESPONSE,
} from "../../helpers/automation/utils";
import {
  setGeoCoordinatesSuccessTest,
  setGeoCoordinatesMissingLatitudeTest,
  setGeoCoordinatesMissingLongitudeTest,
} from "../../helpers/automation";
import { ESPRMAPIManager } from "../../../src/services/ESPRMAPIManager";

describe("[Unit Test]: Automation::ESPRMUser - setGeoCoordinates()", () => {
  let userInstance: ESPRMUser;

  beforeAll(async () => {
    userInstance = await setupAutomationTestEnvironment();
  });

  test("should set geo coordinates successfully", async () => {
    // Mock the authorizeRequest method
    const mockAuthorizeRequest = jest.spyOn(
      ESPRMAPIManager,
      "authorizeRequest"
    );
    mockAuthorizeRequest.mockResolvedValue(
      MOCK_AUTOMATION_RESPONSE.SET_GEO_COORDINATES_SUCCESS
    );
    await setGeoCoordinatesSuccessTest(userInstance, MOCK_GEO_COORDINATES);
  });

  describe("Error Cases", () => {
    test("should throw error when latitude is missing", async () => {
      await setGeoCoordinatesMissingLatitudeTest(userInstance);
    });

    test("should throw error when longitude is missing", async () => {
      await setGeoCoordinatesMissingLongitudeTest(userInstance);
    });
  });

  afterAll(async () => {
    await cleanupAutomationTestEnvironment(userInstance);
  });
});
