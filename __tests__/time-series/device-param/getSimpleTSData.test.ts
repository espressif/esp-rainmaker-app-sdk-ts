/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMAPIManager } from "../../../src/services/ESPRMAPIManager";
import {
  successSimpleTSDataTest,
  missingStartTimeSimpleTSDataTest,
  missingEndTimeSimpleTSDataTest,
  invalidResultCountSimpleTSDataTest,
  nonSimpleTSParamTest,
  invalidDataTypeSimpleTSDataTest,
  invalidTimeRangeSimpleTSDataTest,
  invalidNodeReferenceSimpleTSTest,
} from "../../helpers/time-series";
import {
  MOCK_DEVICE_PARAM_FOR_SIMPLE_TS,
  TS_MOCK_RESPONSES,
} from "../../helpers/time-series/utils";

describe("[Unit Test]: TimeSeries::ESPRMDeviceParam - getSimpleTSData()", () => {
  test("should get simple time series data and return valid response", async () => {
    // Mock the authorizeRequest method
    const mockAuthorizeRequest = jest.spyOn(
      ESPRMAPIManager,
      "authorizeRequest"
    );
    mockAuthorizeRequest.mockResolvedValue(
      TS_MOCK_RESPONSES.GET_SIMPLE_TS_DATA_SUCCESS
    );
    await successSimpleTSDataTest(MOCK_DEVICE_PARAM_FOR_SIMPLE_TS);
  });

  describe("Error Cases", () => {
    test("should throw error when start time is empty", async () => {
      await missingStartTimeSimpleTSDataTest(MOCK_DEVICE_PARAM_FOR_SIMPLE_TS);
    });

    test("should throw error when end time is empty", async () => {
      await missingEndTimeSimpleTSDataTest(MOCK_DEVICE_PARAM_FOR_SIMPLE_TS);
    });

    test("should throw error when time range is invalid", async () => {
      await invalidTimeRangeSimpleTSDataTest(MOCK_DEVICE_PARAM_FOR_SIMPLE_TS);
    });

    test("should throw error when result count is invalid", async () => {
      await invalidResultCountSimpleTSDataTest(MOCK_DEVICE_PARAM_FOR_SIMPLE_TS);
    });

    test("should throw error when parameter does not support simple time series", async () => {
      await nonSimpleTSParamTest(MOCK_DEVICE_PARAM_FOR_SIMPLE_TS);
    });

    test("should throw error when data type is invalid", async () => {
      await invalidDataTypeSimpleTSDataTest(MOCK_DEVICE_PARAM_FOR_SIMPLE_TS);
    });

    test("should throw error when node reference is invalid", async () => {
      await invalidNodeReferenceSimpleTSTest(MOCK_DEVICE_PARAM_FOR_SIMPLE_TS);
    });
  });
});
