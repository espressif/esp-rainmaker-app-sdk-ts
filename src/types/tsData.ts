/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Represents a single data point in a time series.
 */
interface ESPTSData {
  timestamp: number;
  value: number | string | boolean;
}

/**
 * Represents a single data point in a simple time series.
 */
interface ESPTSDataPoint {
  ts: number;
  val: number | string | boolean;
}

/**
 * Represents the data for a single parameter in a simple time series.
 */
interface ESPTSParamData {
  param_name: string;
  values: ESPTSDataPoint[];
  num_records: number;
}

/**
 * Represents the data for a single node in a simple time series.
 */
interface ESPTSNodeData {
  node_id: string;
  params: ESPTSParamData[];
  next_id?: string;
}

/**
 * Represents the response for a simple time series data request.
 */
interface ESPSimpleTSDataResponse {
  tsData: ESPTSData[];
  hasNext: boolean;
  fetchNext?: () => Promise<ESPSimpleTSDataResponse>;
}

/**
 * Represents the request for a simple time series data request.
 */
interface ESPSimpleTSDataRequest {
  startTime: number;
  endTime: number;
  resultCount?: number;
}

/**
 * Enum representing different aggregation methods for time series data.
 */
enum ESPAggregationMethod {
  Raw = "raw",
  Latest = "latest",
  Min = "min",
  Max = "max",
  Count = "count",
  Avg = "avg",
  Sum = "sum",
}

/**
 * Enum representing different time intervals for aggregation.
 */
enum ESPAggregationInterval {
  Minute = "minute",
  Hour = "hour",
  Day = "day",
  Week = "week",
  Month = "month",
  Year = "year",
}

/**
 * Enum representing the start day of the week for time series aggregation.
 */
enum ESPWeekStart {
  Sunday = "Sunday",
  Monday = "Monday",
  Tuesday = "Tuesday",
  Wednesday = "Wednesday",
  Thursday = "Thursday",
  Friday = "Friday",
  Saturday = "Saturday",
}

/**
 * Interface for raw time series data request parameters.
 */
interface ESPRawTSDataRequest {
  startTime?: number;
  endTime?: number;
  timezone?: string;
  resultCount?: number;
  differential?: boolean;
  resetOnNegative?: boolean;
  descOrder?: boolean;
}

/**
 * Interface for time series data request parameters with aggregation options.
 */
interface ESPTSDataRequest extends ESPRawTSDataRequest {
  numIntervals?: number;
  aggregationInterval?: ESPAggregationInterval;
  weekStart?: ESPWeekStart;
  aggregate?: ESPAggregationMethod;
}

/**
 * Interface for custom parameter time series data request parameters.
 */
interface ESPCustomParamTSDataRequest extends ESPTSDataRequest {
  paramName: string;
  dataType: string;
}
/**
 * Interface for custom parameter simple time series data request parameters.
 */
interface ESPCustomParamSimpleTSDataRequest extends ESPSimpleTSDataRequest {
  paramName: string;
  dataType: string;
}
/**
 * Interface for configuration parameters for fetching time series data.
 */
interface FetchTSDataConfig {
  nodeId: string;
  paramName: string;
  endpoint: string;
  requestParams: Record<string, any>;
}

export {
  ESPTSData,
  ESPTSDataPoint,
  ESPTSParamData,
  ESPTSNodeData,
  ESPSimpleTSDataResponse,
  ESPSimpleTSDataRequest,
  ESPAggregationMethod,
  ESPAggregationInterval,
  ESPWeekStart,
  ESPRawTSDataRequest,
  ESPTSDataRequest,
  ESPCustomParamTSDataRequest,
  ESPCustomParamSimpleTSDataRequest,
  FetchTSDataConfig,
};
