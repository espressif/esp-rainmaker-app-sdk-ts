/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPAPICallValidationError } from "../../utils/error/Error";
import { APICallValidationErrorCodes } from "../../utils/constants";
import {
  ESPSimpleTSDataRequest,
  ESPTSDataRequest,
  ESPAggregationMethod,
  ESPAggregationInterval,
  ESPWeekStart,
  ESPCustomParamSimpleTSDataRequest,
  ESPCustomParamTSDataRequest,
} from "../../types/tsData";
import {
  TSCompatibleParamTypes,
  TSDifferentialCompatibleParamTypes,
  Locale,
  TSDataConstants,
} from "../../utils/constants";
import { isValidEnumValue } from "./IsValidEnumValue";
import { isNonEmptyString } from "../../utils/validator/validators";

const validateUnixTimestamp = (timestamp: number): void => {
  // Check if timestamp is a positive integer (epoch seconds)
  if (!Number.isInteger(timestamp)) {
    throw new ESPAPICallValidationError(
      APICallValidationErrorCodes.INVALID_TS_TIMESTAMP
    );
  }
};

const validateTimeRange = (startTime: number, endTime: number): void => {
  validateUnixTimestamp(startTime);
  validateUnixTimestamp(endTime);

  if (startTime > endTime) {
    throw new ESPAPICallValidationError(
      APICallValidationErrorCodes.INVALID_TS_TIME_RANGE
    );
  }
};

const validateResultCount = (resultCount?: number): void => {
  if (
    resultCount !== undefined &&
    (resultCount < TSDataConstants.MIN_RESULT_COUNT ||
      resultCount > TSDataConstants.MAX_RESULT_COUNT)
  ) {
    throw new ESPAPICallValidationError(
      APICallValidationErrorCodes.INVALID_TS_RESULT_COUNT
    );
  }
};

const validateTimezone = (timezone?: string): void => {
  if (timezone) {
    try {
      // Check if the timezone is valid by trying to create a DateTimeFormat with it
      new Intl.DateTimeFormat(Locale.DEFAULT, { timeZone: timezone });
    } catch (error) {
      throw new ESPAPICallValidationError(
        APICallValidationErrorCodes.INVALID_TS_TIMEZONE
      );
    }
  }
};

const validateDifferential = (
  request: ESPTSDataRequest,
  dataType: string
): void => {
  if (request.differential) {
    if (!TSDifferentialCompatibleParamTypes.includes(dataType)) {
      throw new ESPAPICallValidationError(
        APICallValidationErrorCodes.INVALID_TS_DIFFERENTIAL
      );
    }
  }

  if (request.resetOnNegative && !request.differential) {
    throw new ESPAPICallValidationError(
      APICallValidationErrorCodes.INVALID_TS_RESET_ON_NEGATIVE
    );
  }
};

const validateAggregation = (request: ESPTSDataRequest): void => {
  if (request.aggregate) {
    if (!isValidEnumValue(request.aggregate, ESPAggregationMethod)) {
      throw new ESPAPICallValidationError(
        APICallValidationErrorCodes.INVALID_TS_AGGREGATION
      );
    }

    if (
      request.aggregate !== ESPAggregationMethod.Raw &&
      !request.aggregationInterval
    ) {
      throw new ESPAPICallValidationError(
        APICallValidationErrorCodes.MISSING_TS_AGGREGATION_INTERVAL
      );
    }
  }

  if (request.aggregationInterval) {
    if (
      !isValidEnumValue(request.aggregationInterval, ESPAggregationInterval)
    ) {
      throw new ESPAPICallValidationError(
        APICallValidationErrorCodes.INVALID_TS_AGGREGATION_INTERVAL
      );
    }

    // Validate weekStart if aggregationInterval is week
    if (request.aggregationInterval === ESPAggregationInterval.Week) {
      if (!request.weekStart) {
        throw new ESPAPICallValidationError(
          APICallValidationErrorCodes.INVALID_TS_WEEK_START
        );
      }
      if (!isValidEnumValue(request.weekStart, ESPWeekStart)) {
        throw new ESPAPICallValidationError(
          APICallValidationErrorCodes.INVALID_TS_WEEK_START
        );
      }
    }
  }
};

export const validateCustomParamRequest = (
  request: ESPCustomParamSimpleTSDataRequest | ESPCustomParamTSDataRequest
): void => {
  if (!isNonEmptyString(request.paramName)) {
    throw new ESPAPICallValidationError(
      APICallValidationErrorCodes.MISSING_CUSTOM_PARAM_NAME
    );
  }
  if (!isNonEmptyString(request.dataType)) {
    throw new ESPAPICallValidationError(
      APICallValidationErrorCodes.MISSING_CUSTOM_PARAM_DATA_TYPE
    );
  }
};

export const validateSimpleTSDataRequest = (
  request: ESPSimpleTSDataRequest | ESPCustomParamSimpleTSDataRequest,
  dataType: string,
  supportsSimpleTS: boolean,
  isCustomParamRequest: boolean = false
): void => {
  // Check if parameter supports simple_ts
  if (!supportsSimpleTS) {
    throw new ESPAPICallValidationError(
      APICallValidationErrorCodes.INVALID_SIMPLE_TS_PARAMETER
    );
  }

  // Validate custom parameter request
  if (isCustomParamRequest) {
    validateCustomParamRequest(request as ESPCustomParamSimpleTSDataRequest);
  }

  // Validate data type
  if (!TSCompatibleParamTypes.includes(dataType)) {
    throw new ESPAPICallValidationError(
      APICallValidationErrorCodes.INVALID_TS_DATA_TYPE
    );
  }

  // Validate timestamps
  if (!request.startTime || !request.endTime) {
    throw new ESPAPICallValidationError(
      APICallValidationErrorCodes.MISSING_TS_TIMESTAMP
    );
  }

  validateTimeRange(request.startTime, request.endTime);
  validateResultCount(request.resultCount);
};

export const validateTSDataRequest = (
  request: ESPTSDataRequest | ESPCustomParamTSDataRequest,
  dataType: string,
  supportsTS: boolean,
  isCustomParamRequest: boolean = false
): void => {
  // Check if parameter supports time series
  if (!supportsTS) {
    throw new ESPAPICallValidationError(
      APICallValidationErrorCodes.INVALID_TS_PARAMETER
    );
  }
  // Validate custom parameter request
  if (isCustomParamRequest) {
    validateCustomParamRequest(request as ESPCustomParamTSDataRequest);
  }

  // Validate data type
  if (!TSCompatibleParamTypes.includes(dataType)) {
    throw new ESPAPICallValidationError(
      APICallValidationErrorCodes.INVALID_TS_DATA_TYPE
    );
  }

  // Validate time range or numIntervals
  if (request.numIntervals !== undefined) {
    if (request.startTime || request.endTime) {
      throw new ESPAPICallValidationError(
        APICallValidationErrorCodes.INVALID_TS_PARAMETER_MIXED
      );
    }
    if (request.numIntervals < TSDataConstants.MIN_INTERVALS) {
      throw new ESPAPICallValidationError(
        APICallValidationErrorCodes.INVALID_TS_INTERVAL
      );
    }
  } else {
    // Validate timestamps are provided
    if (!request.startTime || !request.endTime) {
      throw new ESPAPICallValidationError(
        APICallValidationErrorCodes.MISSING_TS_TIMESTAMP
      );
    }
    validateTimeRange(request.startTime, request.endTime);
  }

  validateResultCount(request.resultCount);
  validateDifferential(request, dataType);
  validateAggregation(request);
  validateTimezone(request.timezone);
};
