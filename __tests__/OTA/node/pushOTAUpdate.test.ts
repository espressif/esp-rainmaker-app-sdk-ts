/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  OTA_TEST_VALUES,
  MOCK_NODE,
  OTA_MOCK_RESPONSES,
} from "../../helpers/OTA/utils";
import {
  pushOTAUpdateEmptyJobIdTest,
  pushOTAUpdateSuccessTest,
  pushOTAUpdateUndefinedJobIdTest,
} from "../../helpers/OTA";
import { ESPRMAPIManager } from "../../../src/services/ESPRMAPIManager";

describe("[Unit Test]: OTA::ESPRMNode - pushOTAUpdate()", () => {
  test("should push OTA update and return valid response", async () => {
    // Mock the authorizeRequest method
    const mockAuthorizeRequest = jest.spyOn(
      ESPRMAPIManager,
      "authorizeRequest"
    );
    mockAuthorizeRequest.mockResolvedValue(
      OTA_MOCK_RESPONSES.PUSH_OTA_UPDATE_SUCCESS
    );

    await pushOTAUpdateSuccessTest(MOCK_NODE, OTA_TEST_VALUES.MOCK_JOB_ID);
  });

  describe("Error Cases", () => {
    test("should throw error when job ID is empty", async () => {
      await pushOTAUpdateEmptyJobIdTest(MOCK_NODE);
    });

    test("should throw error when job ID is undefined", async () => {
      await pushOTAUpdateUndefinedJobIdTest(MOCK_NODE);
    });
  });
});
