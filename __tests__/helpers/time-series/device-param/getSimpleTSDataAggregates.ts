/*
 * SPDX-FileCopyrightText: 2026 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMDeviceParam } from "../../../../src/index";
import {
  ESPSimpleTSAggregatesRequest,
  ESPSimpleTSAggregateWindow,
} from "../../../../src/types/tsData";
import { ESPAPICallValidationError } from "../../../../src/utils/error/Error";
import { apiCallValidationErrorMessages } from "../../../../src/utils/error/errorMessages";

/**
 * Helper function to test successful simple time series aggregates retrieval
 * @param deviceParam - The device parameter to test
 */
export const successSimpleTSDataAggregatesTest = async (
  deviceParam: ESPRMDeviceParam
) => {
  const request: ESPSimpleTSAggregatesRequest = {
    window: ESPSimpleTSAggregateWindow.Daily,
    startDate: "2026-07-20",
    endDate: "2026-07-21",
    resultCount: 50,
  };

  const response = await deviceParam.getSimpleTSDataAggregates(request);
  expect(response).toBeDefined();
  expect(Array.isArray(response.aggregates)).toBe(true);
  expect(response.aggregates[0].windowType).toBe("daily");
  expect(response.queryInfo).toBeDefined();
  expect(response.hasNext).toBe(true);
  expect(response.fetchNext).toBeDefined();
};

/**
 * Helper function to test error handling when data type does not support aggregates
 * @param deviceParam - The device parameter to test
 */
export const invalidDataTypeSimpleTSDataAggregatesTest = async (
  deviceParam: ESPRMDeviceParam
) => {
  const originalDataType = deviceParam.dataType;
  deviceParam.dataType = "string";

  const request: ESPSimpleTSAggregatesRequest = {
    window: ESPSimpleTSAggregateWindow.Daily,
  };

  try {
    await deviceParam.getSimpleTSDataAggregates(request);
  } catch (error) {
    expect((error as ESPAPICallValidationError).message).toBe(
      apiCallValidationErrorMessages.INVALID_SIMPLE_TS_AGG_DATA_TYPE
    );
  }

  deviceParam.dataType = originalDataType;
};

/**
 * Helper function to test error handling when aggregation window is invalid
 * @param deviceParam - The device parameter to test
 */
export const invalidWindowSimpleTSDataAggregatesTest = async (
  deviceParam: ESPRMDeviceParam
) => {
  const request = {
    window: "yearly",
  } as unknown as ESPSimpleTSAggregatesRequest;

  try {
    await deviceParam.getSimpleTSDataAggregates(request);
  } catch (error) {
    expect((error as ESPAPICallValidationError).message).toBe(
      apiCallValidationErrorMessages.INVALID_SIMPLE_TS_AGG_WINDOW
    );
  }
};

/**
 * Helper function to test error handling when a range query is missing the window
 * @param deviceParam - The device parameter to test
 */
export const missingWindowSimpleTSDataAggregatesTest = async (
  deviceParam: ESPRMDeviceParam
) => {
  const request: ESPSimpleTSAggregatesRequest = {
    startDate: "2026-07-20",
    endDate: "2026-07-21",
  };

  try {
    await deviceParam.getSimpleTSDataAggregates(request);
  } catch (error) {
    expect((error as ESPAPICallValidationError).message).toBe(
      apiCallValidationErrorMessages.MISSING_SIMPLE_TS_AGG_WINDOW
    );
  }
};

/**
 * Helper function to test error handling when the date format is invalid
 * @param deviceParam - The device parameter to test
 */
export const invalidDateSimpleTSDataAggregatesTest = async (
  deviceParam: ESPRMDeviceParam
) => {
  const request: ESPSimpleTSAggregatesRequest = {
    window: ESPSimpleTSAggregateWindow.Daily,
    date: "20-07-2026",
  };

  try {
    await deviceParam.getSimpleTSDataAggregates(request);
  } catch (error) {
    expect((error as ESPAPICallValidationError).message).toBe(
      apiCallValidationErrorMessages.INVALID_SIMPLE_TS_AGG_DATE
    );
  }
};

/**
 * Helper function to test error handling when hour granularity is used with a non-hourly window
 * @param deviceParam - The device parameter to test
 */
export const invalidHourGranularitySimpleTSDataAggregatesTest = async (
  deviceParam: ESPRMDeviceParam
) => {
  const request: ESPSimpleTSAggregatesRequest = {
    window: ESPSimpleTSAggregateWindow.Daily,
    date: "2026-07-20T05",
  };

  try {
    await deviceParam.getSimpleTSDataAggregates(request);
  } catch (error) {
    expect((error as ESPAPICallValidationError).message).toBe(
      apiCallValidationErrorMessages.INVALID_SIMPLE_TS_AGG_DATE
    );
  }
};

/**
 * Helper function to test error handling when the date range is invalid
 * @param deviceParam - The device parameter to test
 */
export const invalidDateRangeSimpleTSDataAggregatesTest = async (
  deviceParam: ESPRMDeviceParam
) => {
  const request: ESPSimpleTSAggregatesRequest = {
    window: ESPSimpleTSAggregateWindow.Daily,
    startDate: "2026-07-21",
    endDate: "2026-07-20",
  };

  try {
    await deviceParam.getSimpleTSDataAggregates(request);
  } catch (error) {
    expect((error as ESPAPICallValidationError).message).toBe(
      apiCallValidationErrorMessages.INVALID_SIMPLE_TS_AGG_DATE_RANGE
    );
  }
};

/**
 * Helper function to test error handling when the result count is invalid
 * @param deviceParam - The device parameter to test
 */
export const invalidResultCountSimpleTSDataAggregatesTest = async (
  deviceParam: ESPRMDeviceParam
) => {
  const request: ESPSimpleTSAggregatesRequest = {
    window: ESPSimpleTSAggregateWindow.Daily,
    startDate: "2026-07-20",
    endDate: "2026-07-21",
    resultCount: 101,
  };

  try {
    await deviceParam.getSimpleTSDataAggregates(request);
  } catch (error) {
    expect((error as ESPAPICallValidationError).message).toBe(
      apiCallValidationErrorMessages.INVALID_SIMPLE_TS_AGG_RESULT_COUNT
    );
  }
};

/**
 * Helper function to test error handling when parameter does not support simple time series
 * @param deviceParam - The device parameter to test
 */
export const nonSimpleTSParamAggregatesTest = async (
  deviceParam: ESPRMDeviceParam
) => {
  const originalProperties = deviceParam.properties;
  deviceParam.properties = [];

  const request: ESPSimpleTSAggregatesRequest = {
    window: ESPSimpleTSAggregateWindow.Daily,
  };

  try {
    await deviceParam.getSimpleTSDataAggregates(request);
  } catch (error) {
    expect((error as ESPAPICallValidationError).message).toBe(
      apiCallValidationErrorMessages.INVALID_SIMPLE_TS_PARAMETER
    );
  }

  deviceParam.properties = originalProperties;
};
