/*
 * SPDX-FileCopyrightText: 2026 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMNode } from "../../../../src/index";
import {
  ESPAggregationMethod,
  ESPCustomParamSimpleTSDataRequest,
} from "../../../../src/types/tsData";
import { ESPAPICallValidationError } from "../../../../src/utils/error/Error";
import { apiCallValidationErrorMessages } from "../../../../src/utils/error/errorMessages";
import { CUSTOM_PARAMETER_DATA } from "../utils";

/**
 * Helper function to test successful custom parameter simple time series data retrieval
 * @param node The node to test
 * @param isRawTSTesting Whether to test raw TS data (default: false)
 */
export const successCustomParamSimpleTSDataTest = async (
  node: ESPRMNode,
  isRawTSTesting = false
) => {
  const request: ESPCustomParamSimpleTSDataRequest = {
    startTime: new Date().getTime() - 24 * 60 * 60 * 1000, // 24 hours ago
    endTime: new Date().getTime(),
    resultCount: 100,
    paramName: CUSTOM_PARAMETER_DATA.NAME,
    dataType: CUSTOM_PARAMETER_DATA.DATA_TYPE,
    ...(isRawTSTesting ? {} : { aggregate: ESPAggregationMethod.Raw }),
  };

  const response = await node.getCustomParamSimpleTSData(request);
  expect(response).toBeDefined();
  expect(response.tsData).toBeDefined();
  expect(Array.isArray(response.tsData)).toBe(true);
};

/**
 * Helper function to test error handling when the custom parameter name is empty
 * @param node The node to test
 */
export const missingParamNameCustomParamSimpleTSDataTest = async (
  node: ESPRMNode
) => {
  const request: ESPCustomParamSimpleTSDataRequest = {
    endTime: new Date().getTime(),
    resultCount: 100,
    dataType: CUSTOM_PARAMETER_DATA.DATA_TYPE,
  } as unknown as ESPCustomParamSimpleTSDataRequest;
  try {
    await node.getCustomParamSimpleTSData(request);
  } catch (error) {
    expect((error as ESPAPICallValidationError).message).toBe(
      apiCallValidationErrorMessages.MISSING_CUSTOM_PARAM_NAME
    );
  }
};

/**
 * Helper function to test error handling when the custom parameter data type is empty
 * @param node The node to test
 */
export const missingDataTypeCustomParamSimpleTSDataTest = async (
  node: ESPRMNode
) => {
  const request: ESPCustomParamSimpleTSDataRequest = {
    endTime: new Date().getTime(),
    resultCount: 100,
    paramName: CUSTOM_PARAMETER_DATA.NAME,
  } as unknown as ESPCustomParamSimpleTSDataRequest;
  try {
    await node.getCustomParamSimpleTSData(request);
  } catch (error) {
    expect((error as ESPAPICallValidationError).message).toBe(
      apiCallValidationErrorMessages.MISSING_CUSTOM_PARAM_DATA_TYPE
    );
  }
};
