/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMAPIManager } from "../ESPRMAPIManager";
import { HTTPMethods } from "../../utils/constants";
import {
  ESPSimpleTSDataResponse,
  ESPTSData,
  ESPTSDataPoint,
  ESPTSNodeData,
  ESPTSParamData,
  FetchTSDataConfig,
} from "../../types/tsData";

export const fetchTSData = async (
  config: FetchTSDataConfig,
  nextIdParam?: string
): Promise<ESPSimpleTSDataResponse> => {
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
  if (!nodeData || !nodeData.params) {
    return {
      tsData: [],
      hasNext: false,
    };
  }

  const paramData: ESPTSParamData = nodeData.params[0];
  if (!paramData) {
    return {
      tsData: [],
      hasNext: false,
    };
  }

  const nextId = nodeData.next_id || null;

  // Transform the data points to match ESPTSData interface
  const tsData: ESPTSData[] = paramData.values.map((point: ESPTSDataPoint) => ({
    timestamp: point.ts,
    value: point.val,
  }));

  const responseData: ESPSimpleTSDataResponse = {
    tsData: tsData,
    hasNext: !!nextId,
  };

  if (nextId) {
    responseData.fetchNext = async () => {
      return fetchTSData(config, nextId);
    };
  }

  return responseData;
};
