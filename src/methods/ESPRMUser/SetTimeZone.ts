/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMUser } from "../../ESPRMUser";
import { ESPAPIResponse } from "../../types";
import {
  APICallValidationErrorCodes,
  Keys,
  StatusMessage,
  ValidationPatterns,
} from "../../utils/constants";
import { ESPAPICallValidationError } from "../../utils/error/ESPAPICallValidationError";
import { validateString } from "../../utils/validator/validators";

/**
 * Augments the ESPRMUser class with the `setTimeZone` method.
 */
declare module "../../ESPRMUser" {
  interface ESPRMUser {
    /**
     * Set the timeZone for the user in the user's custom data.
     * @param timeZoneString The timeZone string to set.
     * @returns A promise that resolves to an ESPAPIResponse indicating the success of the operation.
     */
    setTimeZone(timeZoneString: string): Promise<ESPAPIResponse>;
  }
}

ESPRMUser.prototype.setTimeZone = async function (
  timeZoneString: string
): Promise<ESPAPIResponse> {
  if (!validateString(timeZoneString, ValidationPatterns.TIMEZONE)) {
    throw new ESPAPICallValidationError(
      APICallValidationErrorCodes.INVALID_TIMEZONE_FORMAT
    );
  }
  const requestData = {
    [Keys.TIMEZONE]: {
      value: timeZoneString,
    },
  };
  await this.setCustomData(requestData);
  const successResponse: ESPAPIResponse = {
    status: StatusMessage.SUCCESS,
    description: "TimeZone has been set successfully.",
  };
  return successResponse;
};
