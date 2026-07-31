/*
 * SPDX-FileCopyrightText: 2026 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMAPIManager } from "../../../src/services/ESPRMAPIManager";
import {
  successCustomParamSimpleTSDataAggregatesTest,
  missingParamNameCustomParamSimpleTSDataAggregatesTest,
  missingDataTypeCustomParamSimpleTSDataAggregatesTest,
  invalidDataTypeCustomParamSimpleTSDataAggregatesTest,
} from "../../helpers/time-series";
import { MOCK_NODE, TS_MOCK_RESPONSES } from "../../helpers/time-series/utils";

describe("[Unit Test]: TimeSeries::ESPRMNode - getCustomParamSimpleTSDataAggregates()", () => {
  test("should get simple time series aggregates for custom parameter and return valid response", async () => {
    // Mock the authorizeRequest method
    const mockAuthorizeRequest = jest.spyOn(
      ESPRMAPIManager,
      "authorizeRequest"
    );
    mockAuthorizeRequest.mockResolvedValue(
      TS_MOCK_RESPONSES.GET_SIMPLE_TS_DATA_AGGREGATES_SUCCESS
    );
    await successCustomParamSimpleTSDataAggregatesTest(MOCK_NODE);
  });

  describe("Error Cases", () => {
    test("should throw error when custom parameter name is missing", async () => {
      await missingParamNameCustomParamSimpleTSDataAggregatesTest(MOCK_NODE);
    });

    test("should throw error when custom parameter data type is missing", async () => {
      await missingDataTypeCustomParamSimpleTSDataAggregatesTest(MOCK_NODE);
    });

    test("should throw error when data type does not support aggregates", async () => {
      await invalidDataTypeCustomParamSimpleTSDataAggregatesTest(MOCK_NODE);
    });
  });
});
