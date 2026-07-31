/*
 * SPDX-FileCopyrightText: 2026 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { APIEndpoints, TSDataConstants } from "../../utils/constants";
import {
  ESPCustomParamSimpleTSAggregatesRequest,
  ESPSimpleTSAggregatesResponse,
  FetchTSDataConfig,
} from "../../types/tsData";
import { validateSimpleTSAggregatesRequest } from "../../services/ESPRMHelpers/ValidateTSData";
import { fetchSimpleTSAggregates } from "../../services/ESPRMHelpers/FetchSimpleTSAggregates";
import { ESPRMNode } from "../../ESPRMNode";

/**
 * Augments the ESPRMNode class with the `getCustomParamSimpleTSDataAggregates` method.
 */
declare module "../../ESPRMNode" {
  interface ESPRMNode {
    /**
     * Retrieves simple time series aggregates (hourly/daily/weekly/monthly windows)
     * for a custom parameter.
     * @param request The request parameters for fetching simple time series aggregates
     * @returns A promise that resolves to a paginated response containing aggregate windows
     */
    getCustomParamSimpleTSDataAggregates(
      request: ESPCustomParamSimpleTSAggregatesRequest
    ): Promise<ESPSimpleTSAggregatesResponse>;
  }
}

ESPRMNode.prototype.getCustomParamSimpleTSDataAggregates = async function (
  request: ESPCustomParamSimpleTSAggregatesRequest
): Promise<ESPSimpleTSAggregatesResponse> {
  const isCustomParamCall = true;
  const supportsSimpleTS = true;
  // Validate the request
  validateSimpleTSAggregatesRequest(
    request,
    request.dataType,
    supportsSimpleTS,
    isCustomParamCall
  );

  const config: FetchTSDataConfig = {
    nodeId: this.id,
    paramName: request.paramName,
    endpoint: APIEndpoints.USER_NODE_SIMPLE_TS_DATA,
    requestParams: {
      type: request.dataType,
      query_type: TSDataConstants.AGGREGATES_QUERY_TYPE,
      ...(request.window && { window: request.window }),
      ...(request.date && { date: request.date }),
      ...(request.startDate && { start_date: request.startDate }),
      ...(request.endDate && { end_date: request.endDate }),
      ...(request.resultCount && { num_records: request.resultCount }),
    },
  };

  return await fetchSimpleTSAggregates(config);
};
