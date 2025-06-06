/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMUser } from "../../ESPRMUser";
import { ESPRMAPIManager } from "../../services/ESPRMAPIManager";
import { ESPAPICallValidationError } from "../../utils/error/Error";
import { APICallValidationErrorCodes } from "../../utils/constants";
import { isNonEmptyString } from "../../utils/validator/validators";
import { ESPAutomation } from "../../ESPAutomation";
import { transformAutomationsResponse } from "../../services/ESPRMHelpers/TransformAutomationsResponse";
import { APIEndpoints, HTTPMethods } from "../../utils/constants";

/**
 * Augments the ESPRMUser class with the `getAutomationDetail` method.
 */
declare module "../../ESPRMUser" {
  interface ESPRMUser {
    /**
     * Retrieves an automation based on the provided automation ID.
     * @param automationId - The ID of the automation to be fetched.
     * @returns A promise that resolves to an ESPAutomation instance containing the automation details.
     */
    getAutomationDetail(automationId: string): Promise<ESPAutomation>;
  }
}

ESPRMUser.prototype.getAutomationDetail = async function (
  automationId: string
): Promise<ESPAutomation> {
  if (!isNonEmptyString(automationId)) {
    throw new ESPAPICallValidationError(
      APICallValidationErrorCodes.MISSING_AUTOMATION_ID
    );
  }

  const requestConfig = {
    url: APIEndpoints.USER_NODE_AUTOMATION,
    method: HTTPMethods.GET,
    params: {
      automation_id: automationId,
    },
  };

  const response = await ESPRMAPIManager.authorizeRequest(requestConfig);

  const automationData = transformAutomationsResponse(response);

  return new ESPAutomation(automationData);
};
