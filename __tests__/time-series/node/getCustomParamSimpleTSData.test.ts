/*
 * SPDX-FileCopyrightText: 2026 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMAPIManager } from "../../../src/services/ESPRMAPIManager";
import {
  successCustomParamSimpleTSDataTest,
  missingParamNameCustomParamSimpleTSDataTest,
  missingDataTypeCustomParamSimpleTSDataTest,
} from "../../helpers/time-series";
import { MOCK_NODE, TS_MOCK_RESPONSES } from "../../helpers/time-series/utils";

describe("[Unit Test]: TimeSeries::ESPRMNode - getCustomParamSimpleTSData()", () => {
  test("should get the time series data for a custom parameter and return valid response", async () => {
    // Mock the authorizeRequest method
    const mockAuthorizeRequest = jest.spyOn(
      ESPRMAPIManager,
      "authorizeRequest"
    );
    mockAuthorizeRequest.mockResolvedValue(
      TS_MOCK_RESPONSES.GET_TS_DATA_SUCCESS
    );
    await successCustomParamSimpleTSDataTest(MOCK_NODE);
  });

  describe("Error Cases", () => {
    test("should throw error when the custom parameter name is empty", async () => {
      await missingParamNameCustomParamSimpleTSDataTest(MOCK_NODE);
    });

    test("should throw error when the custom parameter data type is empty", async () => {
      await missingDataTypeCustomParamSimpleTSDataTest(MOCK_NODE);
    });
  });
});
