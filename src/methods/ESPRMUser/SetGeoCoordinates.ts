/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMUser } from "../../ESPRMUser";
import { ESPGeoCoordinates } from "../../types/automation";
import { UserCustomDataRequest } from "../../types/input";
import { ESPAPIResponse } from "../../types/output";
import { APICallValidationErrorCodes, Keys } from "../../utils/constants";
import { ESPAPICallValidationError } from "../../utils/error/Error";
import { isNonEmptyString } from "../../utils/validator/validators";

/**
 * Augments the ESPRMUser class with the `setGeoCoordinates` method.
 */
declare module "../../ESPRMUser" {
  interface ESPRMUser {
    /**
     * Stores the user's geographical coordinates in the custom data.
     * @param geoCoordinates - An object containing the latitude and longitude to be stored.
     * @returns A promise that resolves to an ESPAPIResponse indicating the success of the operation.
     */
    setGeoCoordinates(
      geoCoordinates: ESPGeoCoordinates
    ): Promise<ESPAPIResponse>;
  }
}

ESPRMUser.prototype.setGeoCoordinates = async function (
  geoCoordinates: ESPGeoCoordinates
): Promise<ESPAPIResponse> {
  // Validate required fields
  if (!isNonEmptyString(geoCoordinates.latitude)) {
    throw new ESPAPICallValidationError(
      APICallValidationErrorCodes.MISSING_LATITUDE
    );
  }

  if (!isNonEmptyString(geoCoordinates.longitude)) {
    throw new ESPAPICallValidationError(
      APICallValidationErrorCodes.MISSING_LONGITUDE
    );
  }

  const payload: UserCustomDataRequest = {
    [Keys.GEO_COORDINATES]: {
      value: {
        latitude: geoCoordinates.latitude,
        longitude: geoCoordinates.longitude,
      },
    },
  };

  // Use setCustomData to store the coordinates
  return (await this.setCustomData(payload)) as ESPAPIResponse;
};
