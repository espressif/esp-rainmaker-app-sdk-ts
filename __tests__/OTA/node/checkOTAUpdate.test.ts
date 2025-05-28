/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMAPIManager } from "../../../src/services/ESPRMAPIManager";
import { MOCK_NODE, OTA_MOCK_RESPONSES } from "../../helpers/OTA/utils";
import { checkOTAUpdateSuccessTest } from "../../helpers/OTA";

describe("[Unit Test]: OTA::ESPRMNode - checkOTAUpdate()", () => {
  test("should check for OTA update and return valid response", async () => {
    // Mock the authorizeRequest method
    const mockAuthorizeRequest = jest.spyOn(
      ESPRMAPIManager,
      "authorizeRequest"
    );
    mockAuthorizeRequest.mockResolvedValue(
      OTA_MOCK_RESPONSES.CHECK_OTA_UPDATE_SUCCESS
    );

    await checkOTAUpdateSuccessTest(MOCK_NODE);
  });
});
