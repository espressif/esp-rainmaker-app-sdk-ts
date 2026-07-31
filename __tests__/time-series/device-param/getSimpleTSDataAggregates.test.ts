/*
 * SPDX-FileCopyrightText: 2026 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMAPIManager } from "../../../src/services/ESPRMAPIManager";
import {
  successSimpleTSDataAggregatesTest,
  invalidDataTypeSimpleTSDataAggregatesTest,
  invalidWindowSimpleTSDataAggregatesTest,
  missingWindowSimpleTSDataAggregatesTest,
  invalidDateSimpleTSDataAggregatesTest,
  invalidHourGranularitySimpleTSDataAggregatesTest,
  invalidDateRangeSimpleTSDataAggregatesTest,
  invalidResultCountSimpleTSDataAggregatesTest,
  nonSimpleTSParamAggregatesTest,
} from "../../helpers/time-series";
import {
  MOCK_DEVICE_PARAM_FOR_SIMPLE_TS,
  TS_MOCK_RESPONSES,
} from "../../helpers/time-series/utils";

describe("[Unit Test]: TimeSeries::ESPRMDeviceParam - getSimpleTSDataAggregates()", () => {
  test("should get simple time series aggregates and return valid response", async () => {
    // Mock the authorizeRequest method
    const mockAuthorizeRequest = jest.spyOn(
      ESPRMAPIManager,
      "authorizeRequest"
    );
    mockAuthorizeRequest.mockResolvedValue(
      TS_MOCK_RESPONSES.GET_SIMPLE_TS_DATA_AGGREGATES_SUCCESS
    );
    await successSimpleTSDataAggregatesTest(MOCK_DEVICE_PARAM_FOR_SIMPLE_TS);
  });

  describe("Error Cases", () => {
    test("should throw error when data type does not support aggregates", async () => {
      await invalidDataTypeSimpleTSDataAggregatesTest(
        MOCK_DEVICE_PARAM_FOR_SIMPLE_TS
      );
    });

    test("should throw error when aggregation window is invalid", async () => {
      await invalidWindowSimpleTSDataAggregatesTest(
        MOCK_DEVICE_PARAM_FOR_SIMPLE_TS
      );
    });

    test("should throw error when range query is missing window", async () => {
      await missingWindowSimpleTSDataAggregatesTest(
        MOCK_DEVICE_PARAM_FOR_SIMPLE_TS
      );
    });

    test("should throw error when date format is invalid", async () => {
      await invalidDateSimpleTSDataAggregatesTest(
        MOCK_DEVICE_PARAM_FOR_SIMPLE_TS
      );
    });

    test("should throw error when hour granularity is used with non-hourly window", async () => {
      await invalidHourGranularitySimpleTSDataAggregatesTest(
        MOCK_DEVICE_PARAM_FOR_SIMPLE_TS
      );
    });

    test("should throw error when date range is invalid", async () => {
      await invalidDateRangeSimpleTSDataAggregatesTest(
        MOCK_DEVICE_PARAM_FOR_SIMPLE_TS
      );
    });

    test("should throw error when result count is invalid", async () => {
      await invalidResultCountSimpleTSDataAggregatesTest(
        MOCK_DEVICE_PARAM_FOR_SIMPLE_TS
      );
    });

    test("should throw error when parameter does not support simple time series", async () => {
      await nonSimpleTSParamAggregatesTest(MOCK_DEVICE_PARAM_FOR_SIMPLE_TS);
    });
  });
});
