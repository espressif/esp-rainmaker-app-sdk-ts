/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPAutomation } from "../../ESPAutomation";
import { ESPRMNode } from "../../ESPRMNode";
import { ESPRMAPIManager } from "../../services/ESPRMAPIManager";
import {
  ESPAutomationInterface,
  ESPAutomationDetails,
  ESPAutomationEventType,
  ESPRawAutomationResponse,
} from "../../types/automation";
import {
  APIEndpoints,
  HTTPMethods,
  APICallValidationErrorCodes,
} from "../../utils/constants";
import { ESPAPICallValidationError } from "../../utils/error/Error";

/**
 * Augments the ESPRMNode class with the `addAutomation` method.
 */
declare module "../../ESPRMNode" {
  interface ESPRMNode {
    /**
     * Adds a new automation trigger for the node.
     *
     * @param automationDetails - The details of the automation trigger and action to add.
     * @returns A promise that resolves to an ESPAutomation instance containing details of the newly created automation.
     */
    addAutomation(
      automationDetails: ESPAutomationDetails
    ): Promise<ESPAutomation>;
  }
}

ESPRMNode.prototype.addAutomation = async function (
  automationDetails: ESPAutomationDetails
): Promise<ESPAutomation> {
  // Validate required fields
  if (!automationDetails.name) {
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

  const requestData = constructAutomationRequestPayload(
    this.id,
    automationDetails
  );

  const requestConfig = {
    url: APIEndpoints.USER_NODE_AUTOMATION,
    method: HTTPMethods.POST,
    data: requestData,
  };

  const response = (await ESPRMAPIManager.authorizeRequest(
    requestConfig
  )) as ESPRawAutomationResponse;

  const automation = transformESPAddAutomationResponse(
    response,
    this.id,
    automationDetails
  );

  return new ESPAutomation(automation);
};

/**
 * Constructs the request payload for adding a new automation.
 *
 * @param nodeId - The ID of the node for which the automation is being created.
 * @param automationDetails - The details of the automation trigger and action to add.
 * @returns The constructed request payload object.
 */
function constructAutomationRequestPayload(
  nodeId: string,
  automationDetails: ESPAutomationDetails
) {
  return {
    name: automationDetails.name,
    node_id: nodeId,
    event_type: ESPAutomationEventType.NodeParams,
    events: automationDetails.events.map((event) => ({
      params: {
        [event.deviceName]: {
          [event.param]: event.value,
        },
      },
      check: event.check,
    })),
    event_operator: automationDetails.eventOperator,
    actions: automationDetails.actions.map((action) => ({
      node_id: action.nodeId,
      params: {
        [action.deviceName]: {
          [action.param]: action.value,
        },
      },
    })),
    retrigger: automationDetails.retrigger,
    ...(automationDetails.metadata && { metadata: automationDetails.metadata }),
  };
}

/**
 * Transforms the API response into an ESPAutomationInterface object.
 *
 * @param response - The API response containing automation_id and status.
 * @param nodeId - The ID of the node for which the automation was created.
 * @param automationDetails - The original automation details used to create the automation.
 * @returns An ESPAutomationInterface object containing the transformed data.
 */
function transformESPAddAutomationResponse(
  response: ESPRawAutomationResponse,
  nodeId: string,
  automationDetails: ESPAutomationDetails
): ESPAutomationInterface {
  return {
    automationName: automationDetails.name,
    automationId: response.automation_id,
    enabled: true,
    nodeId: nodeId,
    eventType: ESPAutomationEventType.NodeParams,
    events: automationDetails.events,
    eventOperator: automationDetails.eventOperator,
    actions: automationDetails.actions,
    retrigger: automationDetails.retrigger,
    ...(automationDetails.metadata && { metadata: automationDetails.metadata }),
  };
}
