/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMNode } from "../../ESPRMNode";
import { ESPRMAPIManager } from "../../services/ESPRMAPIManager";
import { ESPAPIResponse } from "../../types/output";
import {
  APICallValidationErrorCodes,
  APIEndpoints,
  ESPServiceParamType,
  ESPServiceType,
  HTTPMethods,
  ValidationPatterns,
} from "../../utils/constants";
import { ESPAPICallValidationError } from "../../utils/error/ESPAPICallValidationError";
import { validateString } from "../../utils/validator/validators";

/**
 * Augments the ESPRMNode class with the `setTimeZone` method.
 */
declare module "../../ESPRMNode" {
  interface ESPRMNode {
    /**
     * Set the timeZone for the node.
     * @param timeZoneString The timeZone string to set.
     * @returns A promise that resolves to an ESPAPIResponse indicating the success of the operation.
     */
    setTimeZone(timeZoneString: string): Promise<ESPAPIResponse>;
  }
}

ESPRMNode.prototype.setTimeZone = async function (
  timeZoneString: string
): Promise<ESPAPIResponse> {
  if (!validateString(timeZoneString, ValidationPatterns.TIMEZONE)) {
    throw new ESPAPICallValidationError(
      APICallValidationErrorCodes.INVALID_TIMEZONE_FORMAT
    );
  }

  const timeService = this.nodeConfig?.services?.find((service) => {
    return service.type === ESPServiceType.TIME;
  });
  if (!timeService) {
    throw new ESPAPICallValidationError(
      APICallValidationErrorCodes.TIME_SERVICE_NOT_AVAILABLE
    );
  }

  const timeZoneParam = timeService.params.find((param) => {
    return param.type === ESPServiceParamType.TIME.TIMEZONE;
  });
  if (!timeZoneParam) {
    throw new ESPAPICallValidationError(
      APICallValidationErrorCodes.TIMEZONE_PARAM_NOT_AVAILABLE
    );
  }

  const payload = {
    node_id: this.id,
    payload: {
      [timeService.name]: {
        [timeZoneParam.name]: timeZoneString,
      },
    },
  };
  const requestConfig = {
    url: APIEndpoints.USER_NODE_PARAM,
    method: HTTPMethods.PUT,
    data: [payload],
  };
  const response = await ESPRMAPIManager.authorizeRequest(requestConfig);
  return response as ESPAPIResponse;
};
