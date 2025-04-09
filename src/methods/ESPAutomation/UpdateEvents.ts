/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPAutomation } from "../../ESPAutomation";
import { ESPAPICallValidationError } from "../../utils/error/Error";
import { APICallValidationErrorCodes } from "../../utils/constants";
import { ESPAPIResponse } from "../../types/output";
import {
  ESPAutomationUpdateDetails,
  ESPAutomationEvent,
  ESPWeatherEvent,
  ESPDaylightEvent,
  ESPWeatherCondition,
} from "../../types/automation";

/**
 * Augments the ESPAutomation class with the `updateEvents` method.
 */
declare module "../../ESPAutomation" {
  interface ESPAutomation {
    /**
     * Updates the events of an existing automation.
     * @param events - An array of event objects defining the conditions that trigger the automation.
     * @returns A promise that resolves to the API response after successful update.
     */
    updateEvents(
      events: (
        | ESPAutomationEvent
        | ESPWeatherEvent
        | ESPWeatherCondition
        | ESPDaylightEvent
      )[]
    ): Promise<ESPAPIResponse>;
  }
}

ESPAutomation.prototype.updateEvents = async function (
  events: (
    | ESPAutomationEvent
    | ESPWeatherEvent
    | ESPWeatherCondition
    | ESPDaylightEvent
  )[]
): Promise<ESPAPIResponse> {
  if (!events || events.length === 0) {
    throw new ESPAPICallValidationError(
      APICallValidationErrorCodes.MISSING_AUTOMATION_EVENTS
    );
  }

  const updateDetails: ESPAutomationUpdateDetails = {
    events,
  };

  const response = await this.update(updateDetails);
  return response;
};
