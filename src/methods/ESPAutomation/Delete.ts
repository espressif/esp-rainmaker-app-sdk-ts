/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPAutomation } from "../../ESPAutomation";
import { ESPRMAPIManager } from "../../services/ESPRMAPIManager";
import { APIEndpoints, HTTPMethods } from "../../utils/constants";
import { ESPAPICallValidationError } from "../../utils/error/Error";
import { APICallValidationErrorCodes } from "../../utils/constants";
import { isNonEmptyString } from "../../utils/validator/validators";
import { ESPAPIResponse } from "../../types/output";

/**
 * Augments the ESPAutomation class with the `delete` method.
 */
declare module "../../ESPAutomation" {
  interface ESPAutomation {
    /**
     * Deletes the automation from the system.
     * @returns A promise that resolves to the API response after successful deletion.
     * @throws {ESPAPICallValidationError} If the automation ID is missing or invalid.
     */
    delete(): Promise<ESPAPIResponse>;
  }
}

ESPAutomation.prototype.delete = async function (): Promise<ESPAPIResponse> {
  if (!isNonEmptyString(this.automationId)) {
    throw new ESPAPICallValidationError(
      APICallValidationErrorCodes.MISSING_AUTOMATION_ID
    );
  }

  const requestParams = {
    automation_id: this.automationId,
  };

  const requestConfig = {
    url: APIEndpoints.USER_NODE_AUTOMATION,
    method: HTTPMethods.DELETE,
    params: requestParams,
  };

  const response = await ESPRMAPIManager.authorizeRequest(requestConfig);
  return response as ESPAPIResponse;
};
