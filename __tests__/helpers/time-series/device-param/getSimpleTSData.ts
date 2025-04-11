/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMDeviceParam } from "../../../../src/index";
import { ESPSimpleTSDataRequest } from "../../../../src/types/tsData";
import { ESPAPICallValidationError } from "../../../../src/utils/error/Error";
import { apiCallValidationErrorMessages } from "../../../../src/utils/error/errorMessages";

/**
 * Helper function to test successful simple time series data retrieval
 * @param deviceParam - The device parameter to test
 */
export const successSimpleTSDataTest = async (
  deviceParam: ESPRMDeviceParam
) => {
  const request: ESPSimpleTSDataRequest = {
    startTime: new Date().getTime() - 24 * 60 * 60 * 1000, // 24 hours ago
    endTime: new Date().getTime(),
    resultCount: 100,
  };

  const response = await deviceParam.getSimpleTSData(request);
  expect(response).toBeDefined();
  expect(response.tsData).toBeDefined();
  expect(Array.isArray(response.tsData)).toBe(true);
};

/**
 * Helper function to test error handling when start time is empty
 * @param deviceParam - The device parameter to test
 */
export const missingStartTimeSimpleTSDataTest = async (
  deviceParam: ESPRMDeviceParam
) => {
  const request = {
    endTime: new Date().getTime(),
    resultCount: 100,
  } as unknown as ESPSimpleTSDataRequest;

  try {
    await deviceParam.getSimpleTSData(request);
  } catch (error) {
    expect((error as ESPAPICallValidationError).message).toBe(
      apiCallValidationErrorMessages.MISSING_TS_TIMESTAMP
    );
  }
};

/**
 * Helper function to test error handling when end time is empty
 * @param deviceParam - The device parameter to test
 */
export const missingEndTimeSimpleTSDataTest = async (
  deviceParam: ESPRMDeviceParam
) => {
  const request = {
    startTime: new Date().getTime() - 24 * 60 * 60 * 1000,
    resultCount: 100,
  } as unknown as ESPSimpleTSDataRequest;

  try {
    await deviceParam.getSimpleTSData(request);
  } catch (error) {
    expect((error as ESPAPICallValidationError).message).toBe(
      apiCallValidationErrorMessages.MISSING_TS_TIMESTAMP
    );
  }
};

/**
 * Helper function to test error handling when time range is invalid
 * @param deviceParam - The device parameter to test
 */
export const invalidTimeRangeSimpleTSDataTest = async (
  deviceParam: ESPRMDeviceParam
) => {
  const request: ESPSimpleTSDataRequest = {
    startTime: new Date().getTime() + 24 * 60 * 60 * 1000,
    endTime: new Date().getTime() - 24 * 60 * 60 * 1000,
    resultCount: 100,
  };
  try {
    await deviceParam.getSimpleTSData(request);
  } catch (error) {
    expect((error as ESPAPICallValidationError).message).toBe(
      apiCallValidationErrorMessages.INVALID_TS_TIME_RANGE
    );
  }
};

/**
 * Helper function to test error handling when result count is invalid
 * @param deviceParam - The device parameter to test
 */
export const invalidResultCountSimpleTSDataTest = async (
  deviceParam: ESPRMDeviceParam
) => {
  const request: ESPSimpleTSDataRequest = {
    startTime: new Date().getTime() - 24 * 60 * 60 * 1000,
    endTime: new Date().getTime(),
    resultCount: -1,
  };

  try {
    await deviceParam.getSimpleTSData(request);
  } catch (error) {
    expect((error as ESPAPICallValidationError).message).toBe(
      apiCallValidationErrorMessages.INVALID_TS_RESULT_COUNT
    );
  }
};

/**
 * Helper function to test error handling when parameter does not support simple time series
 * @param deviceParam - The device parameter to test
 */
export const nonSimpleTSParamTest = async (deviceParam: ESPRMDeviceParam) => {
  // Temporarily modify the properties to simulate non-simple-TS parameter
  const originalProperties = deviceParam.properties;
  deviceParam.properties = [];

  const request: ESPSimpleTSDataRequest = {
    startTime: new Date().getTime() - 24 * 60 * 60 * 1000,
    endTime: new Date().getTime(),
    resultCount: 100,
  };

  try {
    await deviceParam.getSimpleTSData(request);
  } catch (error) {
    expect((error as ESPAPICallValidationError).message).toBe(
      apiCallValidationErrorMessages.INVALID_SIMPLE_TS_PARAMETER
    );
  }

  // Restore original properties
  deviceParam.properties = originalProperties;
};

/**
 * Helper function to test error handling when data type is invalid
 * @param deviceParam - The device parameter to test
 */
export const invalidDataTypeSimpleTSDataTest = async (
  deviceParam: ESPRMDeviceParam
) => {
  // Temporarily modify the data type to simulate invalid data type
  const originalDataType = deviceParam.dataType;
  deviceParam.dataType = "invalid_data_type";

  const request: ESPSimpleTSDataRequest = {
    startTime: new Date().getTime() - 24 * 60 * 60 * 1000,
    endTime: new Date().getTime(),
    resultCount: 100,
  };

  try {
    await deviceParam.getSimpleTSData(request);
  } catch (error) {
    expect((error as ESPAPICallValidationError).message).toBe(
      apiCallValidationErrorMessages.INVALID_TS_DATA_TYPE
    );
  }

  // Restore original data type
  deviceParam.dataType = originalDataType;
};

/**
 * Helper function to test error handling when node reference is invalid
 * @param deviceParam - The device parameter to test
 */
export const invalidNodeReferenceSimpleTSTest = async (
  deviceParam: ESPRMDeviceParam
) => {
  // Create a device param with an invalid node reference by setting nodeRef to undefined
  const originalNodeRef = deviceParam.nodeRef;

  // Create a mock WeakRef that returns undefined when deref() is called
  const mockWeakRef = {
    deref: () => undefined,
  };
  (deviceParam as any).nodeRef = mockWeakRef;

  const request: ESPSimpleTSDataRequest = {
    startTime: new Date().getTime() - 24 * 60 * 60 * 1000,
    endTime: new Date().getTime(),
    resultCount: 100,
  };

  try {
    await deviceParam.getSimpleTSData(request);
  } catch (error) {
    expect((error as ESPAPICallValidationError).message).toBe(
      apiCallValidationErrorMessages.INVALID_NODE_REFERENCE
    );
  }

  // Restore original node reference
  (deviceParam as any).nodeRef = originalNodeRef;
};
