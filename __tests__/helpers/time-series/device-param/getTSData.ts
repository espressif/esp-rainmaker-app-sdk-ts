/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMDeviceParam } from "../../../../src/index";
import {
  ESPTSDataRequest,
  ESPRawTSDataRequest,
  ESPAggregationMethod,
  ESPAggregationInterval,
} from "../../../../src/types/tsData";
import { ESPAPICallValidationError } from "../../../../src/utils/error/Error";
import { apiCallValidationErrorMessages } from "../../../../src/utils/error/errorMessages";

/**
 * Helper function to test successful time series data retrieval
 * @param deviceParam The device parameter to test
 * @param isRawTSTesting Whether to test raw TS data (default: false)
 */
export const successTSDataTest = async (
  deviceParam: ESPRMDeviceParam,
  isRawTSTesting = false
) => {
  const request: ESPTSDataRequest | ESPRawTSDataRequest = {
    startTime: new Date().getTime() - 24 * 60 * 60 * 1000, // 24 hours ago
    endTime: new Date().getTime(),
    resultCount: 100,
    ...(isRawTSTesting ? {} : { aggregate: ESPAggregationMethod.Raw }),
  };

  const response = await (isRawTSTesting
    ? deviceParam.getRawTSData(request as ESPRawTSDataRequest)
    : deviceParam.getTSData(request as ESPTSDataRequest));
  expect(response).toBeDefined();
  expect(response.tsData).toBeDefined();
  expect(Array.isArray(response.tsData)).toBe(true);
};

/**
 * Helper function to test successful raw time series data retrieval
 * @param deviceParam - The device parameter to test
 */
export const successRawTSDataTest = async (deviceParam: ESPRMDeviceParam) => {
  const request: ESPRawTSDataRequest = {
    startTime: new Date().getTime() - 24 * 60 * 60 * 1000, // 24 hours ago
    endTime: new Date().getTime(),
    resultCount: 100,
  };

  const response = await deviceParam.getRawTSData(request);
  expect(response).toBeDefined();
  expect(response.tsData).toBeDefined();
  expect(Array.isArray(response.tsData)).toBe(true);
};

/**
 * Helper function to test error handling when start time is missing
 * @param deviceParam The device parameter to test
 * @param isRawTSTesting Whether to test raw TS data (default: false)
 */
export const missingStartTimeTSDataTest = async (
  deviceParam: ESPRMDeviceParam,
  isRawTSTesting = false
) => {
  const request = {
    endTime: new Date().getTime(),
    resultCount: 100,
    ...(isRawTSTesting ? {} : { aggregate: ESPAggregationMethod.Raw }),
  } as unknown as ESPTSDataRequest | ESPRawTSDataRequest;

  try {
    await (isRawTSTesting
      ? deviceParam.getRawTSData(request as ESPRawTSDataRequest)
      : deviceParam.getTSData(request as ESPTSDataRequest));
  } catch (error) {
    expect((error as ESPAPICallValidationError).message).toBe(
      apiCallValidationErrorMessages.MISSING_TS_TIMESTAMP
    );
  }
};

/**
 * Helper function to test error handling when end time is missing
 * @param deviceParam The device parameter to test
 * @param isRawTSTesting Whether to test raw TS data (default: false)
 */
export const missingEndTimeTSDataTest = async (
  deviceParam: ESPRMDeviceParam,
  isRawTSTesting = false
) => {
  const request = {
    startTime: new Date().getTime() - 24 * 60 * 60 * 1000,
    resultCount: 100,
    ...(isRawTSTesting ? {} : { aggregate: ESPAggregationMethod.Raw }),
  } as unknown as ESPTSDataRequest | ESPRawTSDataRequest;

  try {
    await (isRawTSTesting
      ? deviceParam.getRawTSData(request as ESPRawTSDataRequest)
      : deviceParam.getTSData(request as ESPTSDataRequest));
  } catch (error) {
    expect((error as ESPAPICallValidationError).message).toBe(
      apiCallValidationErrorMessages.MISSING_TS_TIMESTAMP
    );
  }
};

/**
 * Helper function to test error handling when time range is invalid
 * @param deviceParam The device parameter to test
 * @param isRawTSTesting Whether to test raw TS data (default: false)
 */
export const invalidTimeRangeTSDataTest = async (
  deviceParam: ESPRMDeviceParam,
  isRawTSTesting = false
) => {
  const request: ESPTSDataRequest | ESPRawTSDataRequest = {
    startTime: new Date().getTime() + 24 * 60 * 60 * 1000,
    endTime: new Date().getTime() - 24 * 60 * 60 * 1000,
    resultCount: 100,
    ...(isRawTSTesting ? {} : { aggregate: ESPAggregationMethod.Raw }),
  };

  try {
    await (isRawTSTesting
      ? deviceParam.getRawTSData(request as ESPRawTSDataRequest)
      : deviceParam.getTSData(request as ESPTSDataRequest));
  } catch (error) {
    expect((error as ESPAPICallValidationError).message).toBe(
      apiCallValidationErrorMessages.INVALID_TS_TIME_RANGE
    );
  }
};

/**
 * Helper function to test error handling when result count is invalid
 * @param deviceParam The device parameter to test
 * @param isRawTSTesting Whether to test raw TS data (default: false)
 */
export const invalidResultCountTSDataTest = async (
  deviceParam: ESPRMDeviceParam,
  isRawTSTesting = false
) => {
  const request: ESPTSDataRequest | ESPRawTSDataRequest = {
    startTime: new Date().getTime() - 24 * 60 * 60 * 1000,
    endTime: new Date().getTime(),
    resultCount: -1,
    ...(isRawTSTesting ? {} : { aggregate: ESPAggregationMethod.Raw }),
  };

  try {
    await (isRawTSTesting
      ? deviceParam.getRawTSData(request as ESPRawTSDataRequest)
      : deviceParam.getTSData(request as ESPTSDataRequest));
  } catch (error) {
    expect((error as ESPAPICallValidationError).message).toBe(
      apiCallValidationErrorMessages.INVALID_TS_RESULT_COUNT
    );
  }
};

/**
 * Helper function to test error handling when parameter does not support time series
 * @param deviceParam The device parameter to test
 * @param isRawTSTesting Whether to test raw TS data (default: false)
 */
export const nonTSParamTest = async (
  deviceParam: ESPRMDeviceParam,
  isRawTSTesting = false
) => {
  const originalProperties = deviceParam.properties;
  deviceParam.properties = [];

  const request: ESPTSDataRequest | ESPRawTSDataRequest = {
    startTime: new Date().getTime() - 24 * 60 * 60 * 1000,
    endTime: new Date().getTime(),
    resultCount: 100,
    ...(isRawTSTesting ? {} : { aggregate: ESPAggregationMethod.Raw }),
  };

  try {
    await (isRawTSTesting
      ? deviceParam.getRawTSData(request as ESPRawTSDataRequest)
      : deviceParam.getTSData(request as ESPTSDataRequest));
  } catch (error) {
    expect((error as ESPAPICallValidationError).message).toBe(
      apiCallValidationErrorMessages.INVALID_TS_PARAMETER
    );
  }

  deviceParam.properties = originalProperties;
};

/**
 * Helper function to test error handling when data type is invalid
 * @param deviceParam The device parameter to test
 * @param isRawTSTesting Whether to test raw TS data (default: false)
 */
export const invalidDataTypeTSDataTest = async (
  deviceParam: ESPRMDeviceParam,
  isRawTSTesting = false
) => {
  const originalDataType = deviceParam.dataType;
  deviceParam.dataType = "invalid_data_type";

  const request: ESPTSDataRequest | ESPRawTSDataRequest = {
    startTime: new Date().getTime() - 24 * 60 * 60 * 1000,
    endTime: new Date().getTime(),
    resultCount: 100,
    ...(isRawTSTesting ? {} : { aggregate: ESPAggregationMethod.Raw }),
  };

  try {
    await (isRawTSTesting
      ? deviceParam.getRawTSData(request as ESPRawTSDataRequest)
      : deviceParam.getTSData(request as ESPTSDataRequest));
  } catch (error) {
    expect((error as ESPAPICallValidationError).message).toBe(
      apiCallValidationErrorMessages.INVALID_TS_DATA_TYPE
    );
  }

  deviceParam.dataType = originalDataType;
};

/**
 * Helper function to test error handling when numIntervals is provided with start time and end time
 * @param deviceParam The device parameter to test
 * @param isRawTSTesting Whether to test raw TS data (default: false)
 */
export const numIntervalsWithTimeRangeTest = async (
  deviceParam: ESPRMDeviceParam,
  isRawTSTesting = false
) => {
  const request: ESPTSDataRequest | ESPRawTSDataRequest = {
    startTime: new Date().getTime() - 24 * 60 * 60 * 1000,
    endTime: new Date().getTime(),
    numIntervals: 100,
    ...(isRawTSTesting ? {} : { aggregate: ESPAggregationMethod.Raw }),
  };

  try {
    await (isRawTSTesting
      ? deviceParam.getRawTSData(request as ESPRawTSDataRequest)
      : deviceParam.getTSData(request as ESPTSDataRequest));
  } catch (error) {
    expect((error as ESPAPICallValidationError).message).toBe(
      apiCallValidationErrorMessages.INVALID_TS_PARAMETER_MIXED
    );
  }
};

/**
 * Helper function to test error handling invalid differential data type
 * @param deviceParam The device parameter to test
 * @param isRawTSTesting Whether to test raw TS data (default: false)
 */
export const invalidDifferentialDataTypeTest = async (
  deviceParam: ESPRMDeviceParam,
  isRawTSTesting = false
) => {
  const originalDataType = deviceParam.dataType;
  deviceParam.dataType = "string";

  const request: ESPTSDataRequest | ESPRawTSDataRequest = {
    startTime: new Date().getTime() - 24 * 60 * 60 * 1000,
    endTime: new Date().getTime(),
    resultCount: 100,
    differential: true,
    ...(isRawTSTesting ? {} : { aggregate: ESPAggregationMethod.Raw }),
  };

  try {
    await (isRawTSTesting
      ? deviceParam.getRawTSData(request as ESPRawTSDataRequest)
      : deviceParam.getTSData(request as ESPTSDataRequest));
  } catch (error) {
    expect((error as ESPAPICallValidationError).message).toBe(
      apiCallValidationErrorMessages.INVALID_TS_DIFFERENTIAL
    );
  }
  deviceParam.dataType = originalDataType;
};

/**
 * Helper function to test error handling when resetOnNegative is provided without differential
 * @param deviceParam The device parameter to test
 * @param isRawTSTesting Whether to test raw TS data (default: false)
 */
export const resetOnNegativeWithoutDifferentialTest = async (
  deviceParam: ESPRMDeviceParam,
  isRawTSTesting = false
) => {
  const request: ESPTSDataRequest | ESPRawTSDataRequest = {
    startTime: new Date().getTime() - 24 * 60 * 60 * 1000,
    endTime: new Date().getTime(),
    resultCount: 100,
    resetOnNegative: true,
    ...(isRawTSTesting ? {} : { aggregate: ESPAggregationMethod.Raw }),
  };

  try {
    await (isRawTSTesting
      ? deviceParam.getRawTSData(request as ESPRawTSDataRequest)
      : deviceParam.getTSData(request as ESPTSDataRequest));
  } catch (error) {
    expect((error as ESPAPICallValidationError).message).toBe(
      apiCallValidationErrorMessages.INVALID_TS_RESET_ON_NEGATIVE
    );
  }
};

/**
 * Helper function to test error handling when timezone is invalid
 * @param deviceParam The device parameter to test
 * @param isRawTSTesting Whether to test raw TS data (default: false)
 */
export const invalidTimezoneTest = async (
  deviceParam: ESPRMDeviceParam,
  isRawTSTesting = false
) => {
  const request: ESPTSDataRequest | ESPRawTSDataRequest = {
    startTime: new Date().getTime() - 24 * 60 * 60 * 1000,
    endTime: new Date().getTime(),
    resultCount: 100,
    timezone: "invalid_timezone",

    ...(isRawTSTesting ? {} : { aggregate: ESPAggregationMethod.Raw }),
  };

  try {
    await (isRawTSTesting
      ? deviceParam.getRawTSData(request as ESPRawTSDataRequest)
      : deviceParam.getTSData(request as ESPTSDataRequest));
  } catch (error) {
    expect((error as ESPAPICallValidationError).message).toBe(
      apiCallValidationErrorMessages.INVALID_TS_TIMEZONE
    );
  }
};

/**
 * Helper function to test error handling when aggregation method is invalid
 * @param deviceParam The device parameter to test
 */
export const invalidAggregationMethodTest = async (
  deviceParam: ESPRMDeviceParam
) => {
  const request = {
    startTime: new Date().getTime() - 24 * 60 * 60 * 1000,
    endTime: new Date().getTime(),
    resultCount: 100,
    aggregate: "invalid_method",
  } as unknown as ESPTSDataRequest;

  try {
    await deviceParam.getTSData(request);
  } catch (error) {
    expect((error as ESPAPICallValidationError).message).toBe(
      apiCallValidationErrorMessages.INVALID_TS_AGGREGATION
    );
  }
};

/**
 * Helper function to test error handling when aggregation interval is missing
 * @param deviceParam The device parameter to test
 */
export const missingAggregationIntervalTest = async (
  deviceParam: ESPRMDeviceParam
) => {
  const request = {
    startTime: new Date().getTime() - 24 * 60 * 60 * 1000,
    endTime: new Date().getTime(),
    resultCount: 100,
    aggregate: ESPAggregationMethod.Count,
  } as unknown as ESPTSDataRequest;

  try {
    await deviceParam.getTSData(request);
  } catch (error) {
    expect((error as ESPAPICallValidationError).message).toBe(
      apiCallValidationErrorMessages.MISSING_TS_AGGREGATION_INTERVAL
    );
  }
};

/**
 * Helper function to test error handling when aggregation interval is invalid
 * @param deviceParam The device parameter to test
 */
export const invalidAggregationIntervalTest = async (
  deviceParam: ESPRMDeviceParam
) => {
  const request = {
    startTime: new Date().getTime() - 24 * 60 * 60 * 1000,
    endTime: new Date().getTime(),
    resultCount: 100,
    aggregate: ESPAggregationMethod.Count,
    aggregationInterval: "invalid_interval",
  } as unknown as ESPTSDataRequest;

  try {
    await deviceParam.getTSData(request);
  } catch (error) {
    expect((error as ESPAPICallValidationError).message).toBe(
      apiCallValidationErrorMessages.INVALID_TS_AGGREGATION_INTERVAL
    );
  }
};

/**
 * Helper function to test error handling when week start is invalid
 * @param deviceParam The device parameter to test
 */
export const invalidWeekStartTest = async (deviceParam: ESPRMDeviceParam) => {
  const request = {
    startTime: new Date().getTime() - 24 * 60 * 60 * 1000,
    endTime: new Date().getTime(),
    resultCount: 100,
    aggregationInterval: ESPAggregationInterval.Week,
    weekStart: "invalid_week_start",
  } as unknown as ESPTSDataRequest;

  try {
    await deviceParam.getTSData(request);
  } catch (error) {
    expect((error as ESPAPICallValidationError).message).toBe(
      apiCallValidationErrorMessages.INVALID_TS_WEEK_START
    );
  }
};

/**
 * Helper function to test error handling when node reference is invalid
 * @param deviceParam The device parameter to test
 * @param isRawTSTesting Whether to test raw TS data (default: false)
 */
export const invalidNodeReferenceTest = async (
  deviceParam: ESPRMDeviceParam,
  isRawTSTesting = false
) => {
  // Create a device param with an invalid node reference by setting nodeRef to undefined
  const originalNodeRef = deviceParam.nodeRef;

  // Create a mock WeakRef that returns undefined when deref() is called
  const mockWeakRef = {
    deref: () => undefined,
  };
  (deviceParam as any).nodeRef = mockWeakRef;

  const request: ESPTSDataRequest | ESPRawTSDataRequest = {
    startTime: new Date().getTime() - 24 * 60 * 60 * 1000,
    endTime: new Date().getTime(),
    resultCount: 100,
    ...(isRawTSTesting ? {} : { aggregate: ESPAggregationMethod.Raw }),
  };

  try {
    await (isRawTSTesting
      ? deviceParam.getRawTSData(request as ESPRawTSDataRequest)
      : deviceParam.getTSData(request as ESPTSDataRequest));
  } catch (error) {
    expect((error as ESPAPICallValidationError).message).toBe(
      apiCallValidationErrorMessages.INVALID_NODE_REFERENCE
    );
  }

  // Restore original node reference
  (deviceParam as any).nodeRef = originalNodeRef;
};
