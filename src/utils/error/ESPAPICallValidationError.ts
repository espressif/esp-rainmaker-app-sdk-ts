/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { apiCallValidationErrorMessages } from "./errorMessages";
import { ESPBaseError } from "./ESPBaseError";
import { ErrorLabels } from "../constants";

/**
 * Represents an API call validation error.
 *
 * This class extends `ESPBaseError` and provides detailed error information
 * related to validation issues encountered during API calls.
 *
 * @extends ESPBaseError
 */
export class ESPAPICallValidationError extends ESPBaseError {
  /**
   * Constructs a new instance of `ESPAPICallValidationError`.
   *
   * @param code - The error code corresponding to a specific validation error message
   *               from `apiCallValidationErrorMessages`.
   */
  constructor(code: keyof typeof apiCallValidationErrorMessages) {
    super(
      ErrorLabels.ESPAPICallValidationError,
      code,
      apiCallValidationErrorMessages
    );
  }
}
