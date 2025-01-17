/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ErrorLabels } from "../constants";
import { validationErrorMessages } from "./errorMessages";
import { ESPBaseError } from "./ESPBaseError";

/**
 * Represents a validation error encountered during input validation or processing.
 *
 * This class is used to handle errors related to invalid or missing parameters.
 * It extends `ESPBaseError` to provide a structured error-handling mechanism.
 *
 * @extends ESPBaseError
 */
export class ESPValidationError extends ESPBaseError {
  /**
   * Creates an instance of `ESPValidationError`.
   *
   * @param code - The error code corresponding to a specific validation error message
   *               from `validationErrorMessages`.
   */
  constructor(code: keyof typeof validationErrorMessages) {
    super(ErrorLabels.ESPValidationError, code, validationErrorMessages);
  }
}
