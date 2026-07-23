/*
 * SPDX-FileCopyrightText: 2026 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMDeviceParam } from "../../ESPRMDeviceParam";
import {
  APIEndpoints,
  ParamProperties,
  TSDataConstants,
} from "../../utils/constants";
import {
  ESPSimpleTSAggregatesRequest,
  ESPSimpleTSAggregatesResponse,
  FetchTSDataConfig,
} from "../../types/tsData";
import { validateSimpleTSAggregatesRequest } from "../../services/ESPRMHelpers/ValidateTSData";
import { ESPAPICallValidationError } from "../../utils/error/Error";
import { APICallValidationErrorCodes } from "../../utils/constants";
import { fetchSimpleTSAggregates } from "../../services/ESPRMHelpers/FetchSimpleTSAggregates";

/**
 * Augments the ESPRMDeviceParam class with the `getSimpleTSDataAggregates` method.
 */
declare module "../../ESPRMDeviceParam" {
  interface ESPRMDeviceParam {
    /**
     * Retrieves simple time series aggregates (hourly/daily/weekly/monthly windows)
     * for this parameter.
     * @param request The request parameters for fetching simple time series aggregates
     * @returns A promise that resolves to a paginated response containing aggregate windows
     */
    getSimpleTSDataAggregates(
      request: ESPSimpleTSAggregatesRequest
    ): Promise<ESPSimpleTSAggregatesResponse>;
  }
}

ESPRMDeviceParam.prototype.getSimpleTSDataAggregates = async function (
  request: ESPSimpleTSAggregatesRequest
): Promise<ESPSimpleTSAggregatesResponse> {
  const node = this.nodeRef.deref();
  if (!node) {
    throw new ESPAPICallValidationError(
      APICallValidationErrorCodes.INVALID_NODE_REFERENCE
    );
  }

  // Validate the request
  validateSimpleTSAggregatesRequest(
    request,
    this.dataType,
    this.properties.includes(ParamProperties.SIMPLE_TS)
  );

  const APISupportedParamName = `${this.deviceName}.${this.name}`;

  const config: FetchTSDataConfig = {
    nodeId: node.id,
    paramName: APISupportedParamName,
    endpoint: APIEndpoints.USER_NODE_SIMPLE_TS_DATA,
    requestParams: {
      type: this.dataType,
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
