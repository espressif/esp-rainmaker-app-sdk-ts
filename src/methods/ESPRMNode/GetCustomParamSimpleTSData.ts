/*
 * SPDX-FileCopyrightText: 2026 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { APIEndpoints } from "../../utils/constants";
import {
  ESPCustomParamSimpleTSDataRequest,
  ESPSimpleTSDataResponse,
  FetchTSDataConfig,
} from "../../types/tsData";
import { validateSimpleTSDataRequest } from "../../services/ESPRMHelpers/ValidateTSData";
import { fetchTSData } from "../../services/ESPRMHelpers/FetchTSData";
import { ESPRMNode } from "../../ESPRMNode";

/**
 * Augments the ESPRMNode class with the `getCustomParamSimpleTSData` method.
 */
declare module "../../ESPRMNode" {
  interface ESPRMNode {
    /**
     * Retrieves simple time series data in a paginated format for a custom parameter.
     * @param request The request parameters for fetching time series data
     * @returns A promise that resolves to a paginated response containing time series data points
     */
    getCustomParamSimpleTSData(
      request: ESPCustomParamSimpleTSDataRequest
    ): Promise<ESPSimpleTSDataResponse>;
  }
}

ESPRMNode.prototype.getCustomParamSimpleTSData = async function (
  request: ESPCustomParamSimpleTSDataRequest
): Promise<ESPSimpleTSDataResponse> {
  const isCustomParamCall = true;
  const supportsSimpleTS = true;
  // Validate the request
  validateSimpleTSDataRequest(
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
      data_type: request.dataType,
      start_time: request.startTime,
      end_time: request.endTime,
      ...(request.resultCount && { num_records: request.resultCount }),
    },
  };

  return await fetchTSData(config);
};
