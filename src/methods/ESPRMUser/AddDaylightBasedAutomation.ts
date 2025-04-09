/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMUser } from "../../ESPRMUser";
import { ESPRMAPIManager } from "../../services/ESPRMAPIManager";
import { ESPAPICallValidationError } from "../../utils/error/Error";
import { APICallValidationErrorCodes } from "../../utils/constants";
import {
  ESPAutomationInterface,
  ESPDaylightAutomationDetails,
  ESPAutomationEventType,
  ESPRawAutomationResponse,
  ESPGeoCoordinates,
  ESPAutomationConditionOperator,
} from "../../types/automation";
import { APIEndpoints, HTTPMethods } from "../../utils/constants";
import { ESPAutomation } from "../../ESPAutomation";
import { isNonEmptyString } from "../../utils/validator/validators";

/**
 * Augments the ESPRMUser class with the `addDaylightBasedAutomation` method.
 */
declare module "../../ESPRMUser" {
  interface ESPRMUser {
    /**
     * Adds a new daylight-based automation trigger for particular nodes.
     * @param automationDetails - The details of the daylight-based automation trigger and action to add.
     * @returns A promise that resolves to an ESPAutomation instance containing details of the newly created automation.
     */
    addDaylightBasedAutomation(
      automationDetails: ESPDaylightAutomationDetails
    ): Promise<ESPAutomation>;
  }
}

ESPRMUser.prototype.addDaylightBasedAutomation = async function (
  automationDetails: ESPDaylightAutomationDetails
): Promise<ESPAutomation> {
  // Validate required fields
  if (!isNonEmptyString(automationDetails.name)) {
    throw new ESPAPICallValidationError(
      APICallValidationErrorCodes.MISSING_AUTOMATION_NAME
    );
  }

  if (!automationDetails.events || automationDetails.events.length === 0) {
    throw new ESPAPICallValidationError(
      APICallValidationErrorCodes.MISSING_AUTOMATION_EVENTS
    );
  }

  if (!automationDetails.actions || automationDetails.actions.length === 0) {
    throw new ESPAPICallValidationError(
      APICallValidationErrorCodes.MISSING_AUTOMATION_ACTIONS
    );
  }

  // Get location if not provided
  let location = automationDetails.location;
  if (!location) {
    location = await this.getGeoCoordinates();
  }

  // Construct the request payload
  const requestPayload = constructDaylightAutomationRequestPayload(
    automationDetails,
    location
  );

  // Make the API call
  const requestConfig = {
    url: APIEndpoints.USER_NODE_AUTOMATION,
    method: HTTPMethods.POST,
    data: requestPayload,
  };

  const response = (await ESPRMAPIManager.authorizeRequest(
    requestConfig
  )) as ESPRawAutomationResponse;

  const automation = transformESPAddDaylightAutomationResponse(
    response,
    automationDetails,
    location
  );

  return new ESPAutomation(automation);
};

/**
 * Constructs the request payload for adding a daylight-based automation.
 * @param automationDetails - The details of the automation to be added.
 * @param location - The geographical coordinates for the automation.
 * @returns The constructed request payload object.
 */
function constructDaylightAutomationRequestPayload(
  automationDetails: ESPDaylightAutomationDetails,
  location: ESPGeoCoordinates
) {
  return {
    name: automationDetails.name,
    event_type: ESPAutomationEventType.Daylight,
    metadata: automationDetails.metadata,
    event_operator: automationDetails.eventOperator,
    location,
    events: automationDetails.events.map((event) => ({
      params: {
        [event]: true,
      },
      check: ESPAutomationConditionOperator.EQUAL,
    })),
    actions: automationDetails.actions.map((action) => ({
      node_id: action.nodeId,
      params: {
        [action.deviceName]: {
          [action.param]: action.value,
        },
      },
    })),
    retrigger: automationDetails.retrigger,
  };
}

/**
 * Transforms the API response into an ESPAutomationInterface object.
 * @param response - The API response containing automation_id and status.
 * @param automationDetails - The original automation details used to create the automation.
 * @param location - The geographical coordinates for the automation.
 * @returns An ESPAutomationInterface object containing the transformed data.
 */
function transformESPAddDaylightAutomationResponse(
  response: ESPRawAutomationResponse,
  automationDetails: ESPDaylightAutomationDetails,
  location: ESPGeoCoordinates
): ESPAutomationInterface {
  return {
    automationName: automationDetails.name,
    automationId: response.automation_id,
    enabled: true,
    eventType: ESPAutomationEventType.Daylight,
    events: automationDetails.events,
    eventOperator: automationDetails.eventOperator,
    actions: automationDetails.actions,
    retrigger: automationDetails.retrigger,
    metadata: automationDetails.metadata,
    location,
  };
}
