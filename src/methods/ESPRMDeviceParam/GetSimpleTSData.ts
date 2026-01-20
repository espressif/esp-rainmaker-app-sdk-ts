/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMDeviceParam } from "../../ESPRMDeviceParam";
import { APIEndpoints, ParamProperties } from "../../utils/constants";
import {
  ESPSimpleTSDataRequest,
  ESPSimpleTSDataResponse,
  FetchTSDataConfig,
} from "../../types/tsData";
import { validateSimpleTSDataRequest } from "../../services/ESPRMHelpers/ValidateTSData";
import { ESPAPICallValidationError } from "../../utils/error/Error";
import { APICallValidationErrorCodes } from "../../utils/constants";
import { fetchTSData } from "../../services/ESPRMHelpers/FetchTSData";

/**
 * Augments the ESPRMDeviceParam class with the `getSimpleTSData` method.
 */
declare module "../../ESPRMDeviceParam" {
  interface ESPRMDeviceParam {
    /**
     * Retrieves simple time series data in a paginated format for this parameter.
     * @param request The request parameters for fetching time series data
     * @returns A promise that resolves to a paginated response containing time series data points
     */
    getSimpleTSData(
      request: ESPSimpleTSDataRequest
    ): Promise<ESPSimpleTSDataResponse>;
  }
}

ESPRMDeviceParam.prototype.getSimpleTSData = async function (
  request: ESPSimpleTSDataRequest
): Promise<ESPSimpleTSDataResponse> {
  const node = this.nodeRef.deref();
  if (!node) {
    throw new ESPAPICallValidationError(
      APICallValidationErrorCodes.INVALID_NODE_REFERENCE
    );
  }

  // Validate the request
  validateSimpleTSDataRequest(
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
      data_type: this.dataType,
      start_time: request.startTime,
      end_time: request.endTime,
      ...(request.resultCount && { num_records: request.resultCount }),
    },
  };

  return await fetchTSData(config);
};
