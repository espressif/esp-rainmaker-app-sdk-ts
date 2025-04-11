/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMDeviceParam } from "../../ESPRMDeviceParam";
import { APIEndpoints, ParamProperties } from "../../utils/constants";
import {
  ESPTSDataRequest,
  ESPSimpleTSDataResponse,
  FetchTSDataConfig,
} from "../../types/tsData";
import { ESPAPICallValidationError } from "../../utils/error/Error";
import { APICallValidationErrorCodes } from "../../utils/constants";
import { validateTSDataRequest } from "../../services/ESPRMHelpers/ValidateTSData";
import { fetchTSData } from "../../services/ESPRMHelpers/FetchTSData";

/**
 * Augments the ESPRMDeviceParam class with the `getTSData` method.
 */
declare module "../../ESPRMDeviceParam" {
  interface ESPRMDeviceParam {
    /**
     * Retrieves time series data in a paginated format for this parameter.
     * @param request The request parameters for fetching time series data
     * @returns A promise that resolves to a paginated response containing time series data points
     */
    getTSData(request: ESPTSDataRequest): Promise<ESPSimpleTSDataResponse>;
  }
}

ESPRMDeviceParam.prototype.getTSData = async function (
  request: ESPTSDataRequest
): Promise<ESPSimpleTSDataResponse> {
  const node = this.nodeRef.deref();
  if (!node) {
    throw new ESPAPICallValidationError(
      APICallValidationErrorCodes.INVALID_NODE_REFERENCE
    );
  }

  // Validate the request
  validateTSDataRequest(
    request,
    this.dataType,
    this.properties.includes(ParamProperties.TS)
  );

  const config: FetchTSDataConfig = {
    nodeId: node.id,
    paramName: this.name,
    endpoint: APIEndpoints.USER_NODE_TS_DATA,
    requestParams: {
      type: this.dataType,
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
