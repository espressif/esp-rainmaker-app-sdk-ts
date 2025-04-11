/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMDeviceParam } from "../../ESPRMDeviceParam";
import {
  ESPRawTSDataRequest,
  ESPSimpleTSDataResponse,
  ESPTSDataRequest,
  ESPAggregationMethod,
} from "../../types/tsData";

/**
 * Augments the ESPRMDeviceParam class with the `getRawTSData` method.
 */
declare module "../../ESPRMDeviceParam" {
  interface ESPRMDeviceParam {
    /**
     * Retrieves raw time series data in a paginated format for this parameter.
     * This method internally uses getTSData with raw aggregation.
     *
     * @param request The request parameters for fetching raw time series data
     * @returns A promise that resolves to a paginated response containing time series data points
     */
    getRawTSData(
      request: ESPRawTSDataRequest
    ): Promise<ESPSimpleTSDataResponse>;
  }
}

ESPRMDeviceParam.prototype.getRawTSData = async function (
  request: ESPRawTSDataRequest
): Promise<ESPSimpleTSDataResponse> {
  // Convert ESPRawTSDataRequest to ESPTSDataRequest with raw aggregation
  const tsDataRequest: ESPTSDataRequest = {
    ...request,
    aggregate: ESPAggregationMethod.Raw,
  };

  // Use getTSData internally with raw aggregation
  return await this.getTSData(tsDataRequest);
};
