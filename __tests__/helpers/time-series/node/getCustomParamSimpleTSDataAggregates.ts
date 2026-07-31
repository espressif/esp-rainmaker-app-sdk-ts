/*
 * SPDX-FileCopyrightText: 2026 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMNode } from "../../../../src/index";
import {
  ESPCustomParamSimpleTSAggregatesRequest,
  ESPSimpleTSAggregateWindow,
} from "../../../../src/types/tsData";
import { ESPAPICallValidationError } from "../../../../src/utils/error/Error";
import { apiCallValidationErrorMessages } from "../../../../src/utils/error/errorMessages";
import { CUSTOM_PARAMETER_DATA } from "../utils";

/**
 * Helper function to test successful custom parameter simple time series aggregates retrieval
 * @param node The node to test
 */
export const successCustomParamSimpleTSDataAggregatesTest = async (
  node: ESPRMNode
) => {
  const request: ESPCustomParamSimpleTSAggregatesRequest = {
    window: ESPSimpleTSAggregateWindow.Daily,
    startDate: "2026-07-20",
    endDate: "2026-07-21",
    paramName: CUSTOM_PARAMETER_DATA.NAME,
    dataType: CUSTOM_PARAMETER_DATA.DATA_TYPE,
  };

  const response = await node.getCustomParamSimpleTSDataAggregates(request);
  expect(response).toBeDefined();
  expect(Array.isArray(response.aggregates)).toBe(true);
  expect(response.aggregates[0].windowType).toBe("daily");
  expect(response.queryInfo).toBeDefined();
};

/**
 * Helper function to test error handling when the custom parameter name is empty
 * @param node The node to test
 */
export const missingParamNameCustomParamSimpleTSDataAggregatesTest = async (
  node: ESPRMNode
) => {
  const request = {
    window: ESPSimpleTSAggregateWindow.Daily,
    dataType: CUSTOM_PARAMETER_DATA.DATA_TYPE,
  } as unknown as ESPCustomParamSimpleTSAggregatesRequest;
  try {
    await node.getCustomParamSimpleTSDataAggregates(request);
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
export const missingDataTypeCustomParamSimpleTSDataAggregatesTest = async (
  node: ESPRMNode
) => {
  const request = {
    window: ESPSimpleTSAggregateWindow.Daily,
    paramName: CUSTOM_PARAMETER_DATA.NAME,
  } as unknown as ESPCustomParamSimpleTSAggregatesRequest;
  try {
    await node.getCustomParamSimpleTSDataAggregates(request);
  } catch (error) {
    expect((error as ESPAPICallValidationError).message).toBe(
      apiCallValidationErrorMessages.MISSING_CUSTOM_PARAM_DATA_TYPE
    );
  }
};

/**
 * Helper function to test error handling when the data type does not support aggregates
 * @param node The node to test
 */
export const invalidDataTypeCustomParamSimpleTSDataAggregatesTest = async (
  node: ESPRMNode
) => {
  const request: ESPCustomParamSimpleTSAggregatesRequest = {
    window: ESPSimpleTSAggregateWindow.Daily,
    paramName: CUSTOM_PARAMETER_DATA.NAME,
    dataType: "bool",
  };
  try {
    await node.getCustomParamSimpleTSDataAggregates(request);
  } catch (error) {
    expect((error as ESPAPICallValidationError).message).toBe(
      apiCallValidationErrorMessages.INVALID_SIMPLE_TS_AGG_DATA_TYPE
    );
  }
};
