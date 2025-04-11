/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { MOCK_DEVICE_PARAM_FOR_TS } from "../../helpers/time-series/utils";
import {
  successTSDataTest,
  missingStartTimeTSDataTest,
  missingEndTimeTSDataTest,
  invalidTimeRangeTSDataTest,
  invalidResultCountTSDataTest,
  nonTSParamTest,
  invalidDataTypeTSDataTest,
  invalidDifferentialDataTypeTest,
  resetOnNegativeWithoutDifferentialTest,
  invalidTimezoneTest,
  invalidNodeReferenceTest,
} from "../../helpers/time-series";
import { ESPRMAPIManager } from "../../../src/services/ESPRMAPIManager";
import { TS_MOCK_RESPONSES } from "../../helpers/time-series/utils";

describe("[Unit Test]: TimeSeries::ESPRMDeviceParam - getRawTSData()", () => {
  test("should get raw time series data and return valid response", async () => {
    // Mock the authorizeRequest method
    const mockAuthorizeRequest = jest.spyOn(
      ESPRMAPIManager,
      "authorizeRequest"
    );
    mockAuthorizeRequest.mockResolvedValue(
      TS_MOCK_RESPONSES.GET_TS_DATA_SUCCESS
    );
    await successTSDataTest(MOCK_DEVICE_PARAM_FOR_TS, true);
  });

  describe("Error Cases", () => {
    test("should throw error when start time is missing", async () => {
      await missingStartTimeTSDataTest(MOCK_DEVICE_PARAM_FOR_TS, true);
    });

    test("should throw error when end time is missing", async () => {
      await missingEndTimeTSDataTest(MOCK_DEVICE_PARAM_FOR_TS, true);
    });

    test("should throw error when time range is invalid", async () => {
      await invalidTimeRangeTSDataTest(MOCK_DEVICE_PARAM_FOR_TS, true);
    });

    test("should throw error when result count is invalid", async () => {
      await invalidResultCountTSDataTest(MOCK_DEVICE_PARAM_FOR_TS, true);
    });

    test("should throw error when parameter does not support time series", async () => {
      await nonTSParamTest(MOCK_DEVICE_PARAM_FOR_TS, true);
    });

    test("should throw error when data type is invalid", async () => {
      await invalidDataTypeTSDataTest(MOCK_DEVICE_PARAM_FOR_TS, true);
    });

    test("should throw error when differential is provided with unsupported data type", async () => {
      await invalidDifferentialDataTypeTest(MOCK_DEVICE_PARAM_FOR_TS, true);
    });

    test("should throw error when resetOnNegative is provided without differential", async () => {
      await resetOnNegativeWithoutDifferentialTest(
        MOCK_DEVICE_PARAM_FOR_TS,
        true
      );
    });

    test("should throw error when timezone is invalid", async () => {
      await invalidTimezoneTest(MOCK_DEVICE_PARAM_FOR_TS, true);
    });

    test("should throw error when node reference is invalid", async () => {
      await invalidNodeReferenceTest(MOCK_DEVICE_PARAM_FOR_TS, true);
    });
  });
});
