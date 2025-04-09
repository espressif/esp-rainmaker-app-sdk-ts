/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMUser } from "../../ESPRMUser";
import { ESPGeoCoordinates } from "../../types/automation";
import { ESPAPICallValidationError } from "../../utils/error/Error";
import { APICallValidationErrorCodes, Keys } from "../../utils/constants";
import { isNonEmptyString } from "../../utils/validator/validators";
/**
 * Augments the ESPRMUser class with the `getGeoCoordinates` method.
 */
declare module "../../ESPRMUser" {
  interface ESPRMUser {
    /**
     * Retrieves the user's geographical coordinates from the custom data.
     * @returns A promise that resolves to an ESPGeoCoordinates object containing the latitude and longitude.
     * @throws {ESPRMError} If the coordinates are not found in the custom data.
     */
    getGeoCoordinates(): Promise<ESPGeoCoordinates>;
  }
}

ESPRMUser.prototype.getGeoCoordinates =
  async function (): Promise<ESPGeoCoordinates> {
    // Get the custom data
    const customData = await this.getCustomData();

    // Check if geoCoordinates exists in the custom data
    if (
      !customData[Keys.GEO_COORDINATES] ||
      !customData[Keys.GEO_COORDINATES].value
    ) {
      throw new ESPAPICallValidationError(
        APICallValidationErrorCodes.MISSING_GEO_COORDINATES
      );
    }

    const { latitude, longitude } = customData[Keys.GEO_COORDINATES]
      .value as ESPGeoCoordinates;

    // Validate that both latitude and longitude are present
    if (!isNonEmptyString(latitude) || !isNonEmptyString(longitude)) {
      throw new ESPAPICallValidationError(
        APICallValidationErrorCodes.INVALID_GEO_COORDINATES
      );
    }

    return {
      latitude,
      longitude,
    };
  };
