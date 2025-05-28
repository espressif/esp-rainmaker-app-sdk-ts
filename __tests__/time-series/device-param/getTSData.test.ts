/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMAPIManager } from "../../../src/services/ESPRMAPIManager";
import {
  successTSDataTest,
  missingStartTimeTSDataTest,
  missingEndTimeTSDataTest,
  invalidTimeRangeTSDataTest,
  invalidResultCountTSDataTest,
  nonTSParamTest,
  invalidDataTypeTSDataTest,
  invalidAggregationMethodTest,
  numIntervalsWithTimeRangeTest,
  invalidDifferentialDataTypeTest,
  resetOnNegativeWithoutDifferentialTest,
  invalidTimezoneTest,
  missingAggregationIntervalTest,
  invalidAggregationIntervalTest,
  invalidWeekStartTest,
  invalidNodeReferenceTest,
} from "../../helpers/time-series";
import {
  MOCK_DEVICE_PARAM_FOR_TS,
  TS_MOCK_RESPONSES,
} from "../../helpers/time-series/utils";

describe("[Unit Test]: TimeSeries::ESPRMDeviceParam - getTSData()", () => {
  test("should get time series data and return valid response", async () => {
    // Mock the authorizeRequest method
    const mockAuthorizeRequest = jest.spyOn(
      ESPRMAPIManager,
      "authorizeRequest"
    );
    mockAuthorizeRequest.mockResolvedValue(
      TS_MOCK_RESPONSES.GET_TS_DATA_SUCCESS
    );
    await successTSDataTest(MOCK_DEVICE_PARAM_FOR_TS);
  });

  describe("Error Cases", () => {
    test("should throw error when start time is empty", async () => {
      await missingStartTimeTSDataTest(MOCK_DEVICE_PARAM_FOR_TS);
    });

    test("should throw error when end time is empty", async () => {
      await missingEndTimeTSDataTest(MOCK_DEVICE_PARAM_FOR_TS);
    });

    test("should throw error when time range is invalid", async () => {
      await invalidTimeRangeTSDataTest(MOCK_DEVICE_PARAM_FOR_TS);
    });

    test("should throw error when result count is invalid", async () => {
      await invalidResultCountTSDataTest(MOCK_DEVICE_PARAM_FOR_TS);
    });

    test("should throw error when parameter does not support time series", async () => {
      await nonTSParamTest(MOCK_DEVICE_PARAM_FOR_TS);
    });

    test("should throw error when data type is invalid", async () => {
      await invalidDataTypeTSDataTest(MOCK_DEVICE_PARAM_FOR_TS);
    });

    test("should throw error when aggregation method is invalid", async () => {
      await invalidAggregationMethodTest(MOCK_DEVICE_PARAM_FOR_TS);
    });

    test("should throw error when numIntervals is provided with start time and end time", async () => {
      await numIntervalsWithTimeRangeTest(MOCK_DEVICE_PARAM_FOR_TS);
    });

    test("should throw error when differential is provided with unsupported data type", async () => {
      await invalidDifferentialDataTypeTest(MOCK_DEVICE_PARAM_FOR_TS);
    });

    test("should throw error when resetOnNegative is provided without differential", async () => {
      await resetOnNegativeWithoutDifferentialTest(MOCK_DEVICE_PARAM_FOR_TS);
    });

    test("should throw error when timezone is invalid", async () => {
      await invalidTimezoneTest(MOCK_DEVICE_PARAM_FOR_TS);
    });

    test("should throw error when aggregation interval is missing", async () => {
      await missingAggregationIntervalTest(MOCK_DEVICE_PARAM_FOR_TS);
    });

    test("should throw error when aggregation interval is invalid", async () => {
      await invalidAggregationIntervalTest(MOCK_DEVICE_PARAM_FOR_TS);
    });

    test("should throw error when week start is invalid", async () => {
      await invalidWeekStartTest(MOCK_DEVICE_PARAM_FOR_TS);
    });

    test("should throw error when node reference is invalid", async () => {
      await invalidNodeReferenceTest(MOCK_DEVICE_PARAM_FOR_TS);
    });
  });
});
