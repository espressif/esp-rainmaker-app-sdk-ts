/*
 * SPDX-FileCopyrightText: 2026 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMAPIManager } from "../ESPRMAPIManager";
import { HTTPMethods } from "../../utils/constants";
import {
  ESPSimpleTSAggregate,
  ESPSimpleTSAggregatesQueryInfo,
  ESPSimpleTSAggregatesResponse,
  ESPTSNodeData,
  ESPTSRawAggregate,
  ESPTSRawAggregatesQueryInfo,
  FetchTSDataConfig,
} from "../../types/tsData";

/**
 * Transforms a single aggregate window entry from the API's snake_case wire
 * format into the SDK's camelCase `ESPSimpleTSAggregate` shape.
 *
 * Note: for parameters ingested with `cumulative: true` (meter-style counters),
 * `count`/`sum`/`min`/`max`/`average` represent consumption deltas between
 * consecutive readings within the window, and `cumulativeValue` holds the
 * latest absolute meter reading. For non-cumulative parameters they are plain
 * statistics of the raw readings.
 *
 * @param aggregate The aggregate window entry as returned by the API
 * @returns The transformed aggregate window entry
 */
const transformAggregate = (
  aggregate: ESPTSRawAggregate
): ESPSimpleTSAggregate => ({
  date: aggregate.date,
  windowType: aggregate.window_type,
  count: aggregate.count,
  sum: aggregate.sum,
  min: aggregate.min,
  max: aggregate.max,
  average: aggregate.average,
  firstValue: aggregate.first_value,
  lastValue: aggregate.last_value,
  cumulativeValue: aggregate.cumulative_value,
  windowStart: aggregate.window_start,
  windowEnd: aggregate.window_end,
  cumulative: aggregate.cumulative,
  status: aggregate.status,
  message: aggregate.message,
  timezone: aggregate.tz,
});

/**
 * Transforms the query info echoed back by the API from its snake_case wire
 * format into the SDK's camelCase `ESPSimpleTSAggregatesQueryInfo` shape.
 *
 * @param queryInfo The query info object as returned by the API
 * @returns The transformed query info
 */
const transformQueryInfo = (
  queryInfo: ESPTSRawAggregatesQueryInfo
): ESPSimpleTSAggregatesQueryInfo => ({
  parameter: queryInfo.parameter,
  windowType: queryInfo.window_type,
  date: queryInfo.date,
  startDate: queryInfo.start_date,
  endDate: queryInfo.end_date,
});

/**
 * Fetches simple time series aggregates (`query_type=aggregates`) for a single
 * node parameter and transforms the response into `ESPSimpleTSAggregatesResponse`.
 *
 * Handles pagination via the node-level `next_id` cursor: when the response
 * contains one, `hasNext` is set to true and `fetchNext()` re-issues the same
 * request with `start_id=<next_id>`.
 *
 * @param config The request configuration containing node ID, parameter name,
 * endpoint and query parameters
 * @param nextIdParam Optional pagination cursor sent as `start_id`; used
 * internally by `fetchNext()` for subsequent pages
 * @returns A promise that resolves to the transformed aggregates response
 */
export const fetchSimpleTSAggregates = async (
  config: FetchTSDataConfig,
  nextIdParam?: string
): Promise<ESPSimpleTSAggregatesResponse> => {
  const apiRequest = {
    node_id: config.nodeId,
    param_name: config.paramName,
    ...config.requestParams,
    ...(nextIdParam && { start_id: nextIdParam }),
  };

  const requestConfig = {
    url: config.endpoint,
    method: HTTPMethods.GET,
    params: apiRequest,
  };

  const response = await ESPRMAPIManager.authorizeRequest(requestConfig);

  // Since we're querying for a specific node and parameter, we can directly access the first item
  const nodeData: ESPTSNodeData = response.ts_data[0];
  if (!nodeData || !nodeData.aggregates) {
    return {
      aggregates: [],
      hasNext: false,
    };
  }

  const nextId = nodeData.next_id || null;

  const responseData: ESPSimpleTSAggregatesResponse = {
    aggregates: nodeData.aggregates.map(transformAggregate),
    hasNext: !!nextId,
  };

  if (nodeData.query_info) {
    responseData.queryInfo = transformQueryInfo(nodeData.query_info);
  }

  if (nextId) {
    responseData.fetchNext = async () => {
      return fetchSimpleTSAggregates(config, nextId);
    };
  }

  return responseData;
};
