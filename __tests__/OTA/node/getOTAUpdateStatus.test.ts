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
  getOTAUpdateStatusEmptyJobIdTest,
  getOTAUpdateStatusSuccessTest,
  getOTAUpdateStatusUndefinedJobIdTest,
} from "../../helpers/OTA";
import { ESPRMAPIManager } from "../../../src/services/ESPRMAPIManager";

describe("[Unit Test]: OTA::ESPRMNode - getOTAUpdateStatus()", () => {
  test("should get OTA update status and return valid response", async () => {
    // Mock the authorizeRequest method
    const mockAuthorizeRequest = jest.spyOn(
      ESPRMAPIManager,
      "authorizeRequest"
    );
    mockAuthorizeRequest.mockResolvedValue(
      OTA_MOCK_RESPONSES.GET_OTA_UPDATE_STATUS_SUCCESS
    );

    await getOTAUpdateStatusSuccessTest(MOCK_NODE, OTA_TEST_VALUES.MOCK_JOB_ID);
  });

  describe("Error Cases", () => {
    test("should throw error when job ID is empty", async () => {
      await getOTAUpdateStatusEmptyJobIdTest(MOCK_NODE);
    });

    test("should throw error when job ID is undefined", async () => {
      await getOTAUpdateStatusUndefinedJobIdTest(MOCK_NODE);
    });
  });
});
