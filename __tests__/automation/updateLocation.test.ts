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
  updateAutomationLocationMissingLatitudeTest,
  updateAutomationLocationMissingLongitudeTest,
  updateAutomationLocationSuccessTest,
} from "../helpers/automation";
import { ESPRMAPIManager } from "../../src/services/ESPRMAPIManager";

describe("[Unit Test]: Automation - updateLocation()", () => {
  test("should update location successfully", async () => {
    // Mock the authorizeRequest method
    const mockAuthorizeRequest = jest.spyOn(
      ESPRMAPIManager,
      "authorizeRequest"
    );
    mockAuthorizeRequest.mockResolvedValue(
      MOCK_AUTOMATION_RESPONSE.UPDATE_LOCATION_SUCCESS
    );
    await updateAutomationLocationSuccessTest(MOCK_AUTOMATION, {
      latitude: "0",
      longitude: "0",
    });
  });

  describe("Error Cases", () => {
    test("should throw error for missing latitude while updating automation location", async () => {
      await updateAutomationLocationMissingLatitudeTest(MOCK_AUTOMATION);
    });
    test("should throw error for missing longitude while updating automation location", async () => {
      await updateAutomationLocationMissingLongitudeTest(MOCK_AUTOMATION);
    });
  });
});
