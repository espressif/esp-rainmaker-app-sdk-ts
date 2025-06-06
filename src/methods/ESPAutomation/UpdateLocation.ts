/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPAutomation } from "../../ESPAutomation";
import { ESPAPICallValidationError } from "../../utils/error/Error";
import { APICallValidationErrorCodes } from "../../utils/constants";
import { isNonEmptyString } from "../../utils/validator/validators";
import { ESPAPIResponse } from "../../types/output";
import {
  ESPAutomationUpdateDetails,
  ESPGeoCoordinates,
} from "../../types/automation";

/**
 * Augments the ESPAutomation class with the `updateLocation` method.
 */
declare module "../../ESPAutomation" {
  interface ESPAutomation {
    /**
     * Updates the location of an existing automation.
     * @param location - The new location coordinates for the automation.
     * @returns A promise that resolves to the API response after successful update.
     */
    updateLocation(location: ESPGeoCoordinates): Promise<ESPAPIResponse>;
  }
}

ESPAutomation.prototype.updateLocation = async function (
  location: ESPGeoCoordinates
): Promise<ESPAPIResponse> {
  if (!isNonEmptyString(location.latitude)) {
    throw new ESPAPICallValidationError(
      APICallValidationErrorCodes.MISSING_LATITUDE
    );
  }
  if (!isNonEmptyString(location.longitude)) {
    throw new ESPAPICallValidationError(
      APICallValidationErrorCodes.MISSING_LONGITUDE
    );
  }

  const updateDetails: ESPAutomationUpdateDetails = {
    location,
  };

  const response = await this.update(updateDetails);
  return response;
};
