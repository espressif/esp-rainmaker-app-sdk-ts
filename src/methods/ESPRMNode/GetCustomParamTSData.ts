/*
 * SPDX-FileCopyrightText: 2026 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMNode } from "../../ESPRMNode";
import { APIEndpoints } from "../../utils/constants";
import {
  ESPCustomParamTSDataRequest,
  ESPSimpleTSDataResponse,
  FetchTSDataConfig,
} from "../../types/tsData";
import { validateTSDataRequest } from "../../services/ESPRMHelpers/ValidateTSData";
import { fetchTSData } from "../../services/ESPRMHelpers/FetchTSData";

/**
 * Augments the ESPRMNode class with the `getCustomParamTSData` method.
 */
declare module "../../ESPRMNode" {
  interface ESPRMNode {
    /**
     * Retrieves time series data in a paginated format for a custom parameter.
     * @param request The request parameters for fetching time series data
     * @returns A promise that resolves to a paginated response containing time series data points
     */
    getCustomParamTSData(
      request: ESPCustomParamTSDataRequest
    ): Promise<ESPSimpleTSDataResponse>;
  }
}

ESPRMNode.prototype.getCustomParamTSData = async function (
  request: ESPCustomParamTSDataRequest
): Promise<ESPSimpleTSDataResponse> {
  // Validate the request
  const isCustomParamCall = true;
  const supportsTS = true;
  validateTSDataRequest(
    request,
    request.dataType,
    supportsTS,
    isCustomParamCall
  );

  const config: FetchTSDataConfig = {
    nodeId: this.id,
    paramName: request.paramName,
    endpoint: APIEndpoints.USER_NODE_TS_DATA,
    requestParams: {
      type: request.dataType,
      ...(request.startTime && { start_time: request.startTime }),
      ...(request.endTime && { end_time: request.endTime }),
      ...(request.numIntervals && { num_intervals: request.numIntervals }),
      ...(request.resultCount && { num_records: request.resultCount }),
      ...(request.differential && { differential: request.differential }),
      ...(request.resetOnNegative && {
        reset_on_negative: request.resetOnNegative,
      }),
      ...(request.descOrder && { desc_order: request.descOrder }),
      ...(request.timezone && { timezone: request.timezone }),
      ...(request.aggregate && { aggregate: request.aggregate }),
      ...(request.aggregationInterval && {
        aggregation_interval: request.aggregationInterval,
      }),
      ...(request.weekStart && { week_start: request.weekStart }),
    },
  };

  return await fetchTSData(config);
};
