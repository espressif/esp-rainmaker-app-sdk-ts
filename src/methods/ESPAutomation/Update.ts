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
import {
  ESPAutomationEvent,
  ESPAutomationUpdateDetails,
  ESPDaylightEvent,
} from "../../types/automation";
import { ESPAutomationEventType } from "../../types/automation";

/**
 * Augments the ESPAutomation class with the `update` method.
 */
declare module "../../ESPAutomation" {
  interface ESPAutomation {
    /**
     * Updates an existing automation with new details.
     * @param automationDetails - The updated details for the automation.
     * @returns A promise that resolves to the API response after successful update.
     */
    update(
      automationDetails: ESPAutomationUpdateDetails
    ): Promise<ESPAPIResponse>;
  }
}

ESPAutomation.prototype.update = async function (
  automationDetails: ESPAutomationUpdateDetails
): Promise<ESPAPIResponse> {
  // Validate automation ID
  if (!isNonEmptyString(this.automationId)) {
    throw new ESPAPICallValidationError(
      APICallValidationErrorCodes.MISSING_AUTOMATION_ID
    );
  }

  // Validate that at least one field is provided
  if (
    !automationDetails.name &&
    automationDetails.nodeId === undefined &&
    automationDetails.enabled === undefined &&
    automationDetails.metadata === undefined &&
    !automationDetails.location &&
    !automationDetails.events &&
    !automationDetails.eventOperator &&
    !automationDetails.actions &&
    automationDetails.retrigger === undefined
  ) {
    throw new ESPAPICallValidationError(
      APICallValidationErrorCodes.MISSING_AUTOMATION_UPDATE_DETAILS
    );
  }

  // Construct request payload
  const requestPayload: Record<string, any> = {
    ...(isNonEmptyString(automationDetails.name) && {
      name: automationDetails.name,
    }),
    ...(isNonEmptyString(automationDetails.nodeId) && {
      node_id: automationDetails.nodeId,
    }),
    ...(automationDetails.enabled !== undefined && {
      enabled: automationDetails.enabled,
    }),
    ...(automationDetails.retrigger !== undefined && {
      retrigger: automationDetails.retrigger,
    }),
    ...(automationDetails.eventOperator && {
      event_operator: automationDetails.eventOperator,
    }),
    ...(automationDetails.metadata !== undefined && {
      metadata: automationDetails.metadata,
    }),
  };

  if (automationDetails.location) {
    if (!isNonEmptyString(automationDetails.location.latitude)) {
      throw new ESPAPICallValidationError(
        APICallValidationErrorCodes.MISSING_LATITUDE
      );
    }
    if (!isNonEmptyString(automationDetails.location.longitude)) {
      throw new ESPAPICallValidationError(
        APICallValidationErrorCodes.MISSING_LONGITUDE
      );
    }
    requestPayload.location = automationDetails.location;
  }

  // Transform events based on event type
  if (automationDetails.events) {
    switch (this.eventType) {
      case ESPAutomationEventType.Daylight:
        requestPayload.events = automationDetails.events.map((event) => {
          const eventPayload = event as ESPDaylightEvent;
          return {
            params: {
              [eventPayload]: true,
            },
            check: "==",
          };
        });
        break;
      case ESPAutomationEventType.Weather:
        requestPayload.events = automationDetails.events.map((event) => {
          if (typeof event === "string") {
            return {
              params: {
                weather_condition: event,
              },
              check: "==",
            };
          }
          return {
            params: {
              [event.param]: event.value,
            },
            check: event.check,
          };
        });
        break;
      case ESPAutomationEventType.NodeParams:
        requestPayload.events = automationDetails.events.map((event) => {
          const eventPayload = event as ESPAutomationEvent;
          return {
            params: {
              [eventPayload.deviceName]: {
                [eventPayload.param]: eventPayload.value,
              },
            },
            check: eventPayload.check,
          };
        });
        break;
    }
  }

  // Transform actions
  if (automationDetails.actions) {
    requestPayload.actions = automationDetails.actions.map((action) => ({
      node_id: action.nodeId,
      params: {
        [action.deviceName]: {
          [action.param]: action.value,
        },
      },
    }));
  }

  const requestConfig = {
    url: APIEndpoints.USER_NODE_AUTOMATION,
    method: HTTPMethods.PUT,
    params: {
      automation_id: this.automationId,
    },
    data: requestPayload,
  };

  const response = await ESPRMAPIManager.authorizeRequest(requestConfig);
  return response;
};
