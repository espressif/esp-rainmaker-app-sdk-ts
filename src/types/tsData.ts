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
 * Represents a single aggregate window entry of a simple time series
 * aggregates response, as returned by the API.
 */
interface ESPTSRawAggregate {
  date: string;
  window_type: string;
  count?: number;
  sum?: number;
  min?: number;
  max?: number;
  average?: number;
  first_value?: number;
  last_value?: number;
  cumulative_value?: number;
  window_start?: number;
  window_end?: number;
  cumulative?: boolean;
  status?: string;
  message?: string;
  tz?: string;
}

/**
 * Represents the query info of a simple time series aggregates response,
 * as returned by the API.
 */
interface ESPTSRawAggregatesQueryInfo {
  parameter?: string;
  window_type?: string;
  date?: string;
  start_date?: string;
  end_date?: string;
}

/**
 * Represents the data for a single node in a simple time series.
 */
interface ESPTSNodeData {
  node_id: string;
  params: ESPTSParamData[];
  aggregates?: ESPTSRawAggregate[];
  query_info?: ESPTSRawAggregatesQueryInfo;
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
 * Enum representing the aggregation windows supported by the simple time
 * series aggregates API.
 */
enum ESPSimpleTSAggregateWindow {
  Hourly = "hourly",
  Daily = "daily",
  Weekly = "weekly",
  Monthly = "monthly",
}

/**
 * Interface for simple time series aggregates request parameters.
 *
 * Query modes:
 * - No date fields: current (live) aggregates, optionally for a single `window`.
 * - `date`: historical aggregates for a single window on that date
 *   (`YYYY-MM-DD`, or `YYYY-MM-DDTHH` for the hourly window only).
 * - `startDate` + `endDate`: historical range query (`window` is required).
 */
interface ESPSimpleTSAggregatesRequest {
  window?: ESPSimpleTSAggregateWindow;
  date?: string;
  startDate?: string;
  endDate?: string;
  resultCount?: number;
}

/**
 * Interface for custom parameter simple time series aggregates request parameters.
 */
interface ESPCustomParamSimpleTSAggregatesRequest extends ESPSimpleTSAggregatesRequest {
  paramName: string;
  dataType: string;
}

/**
 * Represents a single aggregate window entry in a simple time series
 * aggregates response.
 *
 * When `cumulative` is true (meter-style counter parameters), `count`, `sum`,
 * `min`, `max` and `average` are computed over consumption deltas between
 * consecutive readings within the window — not over the raw readings.
 */
interface ESPSimpleTSAggregate {
  date: string;
  windowType: string;
  count?: number;
  sum?: number;
  min?: number;
  max?: number;
  average?: number;
  firstValue?: number;
  lastValue?: number;
  /** Latest absolute meter reading; only meaningful when `cumulative` is true. */
  cumulativeValue?: number;
  windowStart?: number;
  windowEnd?: number;
  /** Whether the parameter was ingested as a cumulative (monotonically increasing) counter. */
  cumulative?: boolean;
  status?: string;
  message?: string;
  timezone?: string;
}

/**
 * Represents the query info echoed back in a simple time series aggregates response.
 */
interface ESPSimpleTSAggregatesQueryInfo {
  parameter?: string;
  windowType?: string;
  date?: string;
  startDate?: string;
  endDate?: string;
}

/**
 * Represents the response for a simple time series aggregates request.
 */
interface ESPSimpleTSAggregatesResponse {
  aggregates: ESPSimpleTSAggregate[];
  queryInfo?: ESPSimpleTSAggregatesQueryInfo;
  hasNext: boolean;
  fetchNext?: () => Promise<ESPSimpleTSAggregatesResponse>;
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
  ESPTSRawAggregate,
  ESPTSRawAggregatesQueryInfo,
  ESPSimpleTSAggregateWindow,
  ESPSimpleTSAggregatesRequest,
  ESPCustomParamSimpleTSAggregatesRequest,
  ESPSimpleTSAggregate,
  ESPSimpleTSAggregatesQueryInfo,
  ESPSimpleTSAggregatesResponse,
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
