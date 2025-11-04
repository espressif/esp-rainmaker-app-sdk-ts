/*
 * SPDX-FileCopyrightText: 2026 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMNode } from "../../../../src/index";
import {
  ESPAggregationMethod,
  ESPCustomParamTSDataRequest,
} from "../../../../src/types/tsData";
import { ESPAPICallValidationError } from "../../../../src/utils/error/Error";
import { apiCallValidationErrorMessages } from "../../../../src/utils/error/errorMessages";
import { CUSTOM_PARAMETER_DATA } from "../utils";

/**
 * Helper function to test successful custom parameter time series data retrieval
 * @param node The node to test
 * @param isRawTSTesting Whether to test raw TS data (default: false)
 */
export const successCustomParamTSDataTest = async (
  node: ESPRMNode,
  isRawTSTesting = false
) => {
  const request: ESPCustomParamTSDataRequest = {
    startTime: new Date().getTime() - 24 * 60 * 60 * 1000, // 24 hours ago
    endTime: new Date().getTime(),
    resultCount: 100,
    paramName: CUSTOM_PARAMETER_DATA.NAME,
    dataType: CUSTOM_PARAMETER_DATA.DATA_TYPE,
    ...(isRawTSTesting ? {} : { aggregate: ESPAggregationMethod.Raw }),
  };

  const response = await node.getCustomParamTSData(request);
  expect(response).toBeDefined();
  expect(response.tsData).toBeDefined();
  expect(Array.isArray(response.tsData)).toBe(true);
};

/**
 * Helper function to test error handling when the custom parameter name is empty
 * @param node The node to test
 */
export const missingParamNameCustomParamTSDataTest = async (
  node: ESPRMNode
) => {
  const request: ESPCustomParamTSDataRequest = {
    endTime: new Date().getTime(),
    resultCount: 100,
    dataType: CUSTOM_PARAMETER_DATA.DATA_TYPE,
  } as unknown as ESPCustomParamTSDataRequest;
  try {
    await node.getCustomParamTSData(request);
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
export const missingDataTypeCustomParamTSDataTest = async (node: ESPRMNode) => {
  const request: ESPCustomParamTSDataRequest = {
    endTime: new Date().getTime(),
    resultCount: 100,
    paramName: CUSTOM_PARAMETER_DATA.NAME,
  } as unknown as ESPCustomParamTSDataRequest;
  try {
    await node.getCustomParamTSData(request);
  } catch (error) {
    expect((error as ESPAPICallValidationError).message).toBe(
      apiCallValidationErrorMessages.MISSING_CUSTOM_PARAM_DATA_TYPE
    );
  }
};
