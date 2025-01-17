/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ErrorLabels } from "../constants";
import { configErrorMessages, defaultErrorMessages } from "./errorMessages";
import { ESPBaseError } from "./ESPBaseError";

/**
 * Represents a configuration error in the SDK.
 *
 * This class extends `ESPBaseError` and is used to handle errors related to
 * configuration issues during SDK setup or runtime operations.
 *
 * @extends ESPBaseError
 */
export class ESPConfigError extends ESPBaseError {
  /**
   * Constructs a new instance of `ESPConfigError`.
   *
   * @param code - The error code corresponding to a specific configuration error message
   *               from `configErrorMessages`.
   */
  constructor(code: keyof typeof configErrorMessages) {
    super(
      ErrorLabels.ESPConfigError,
      code,
      configErrorMessages,
      defaultErrorMessages.CONFIGURATION_ERROR
    );
  }
}
