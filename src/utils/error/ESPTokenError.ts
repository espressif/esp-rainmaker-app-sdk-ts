/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ErrorLabels } from "../constants";
import { tokenErrorMessages } from "./errorMessages";
import { ESPBaseError } from "./ESPBaseError";

/**
 * Represents an error related to authentication tokens.
 *
 * This class is used to handle errors that occur during token-related operations,
 * such as missing or invalid tokens. It extends `ESPBaseError` to provide a structured
 * and consistent error-handling mechanism.
 *
 * @extends ESPBaseError
 */
export class ESPTokenError extends ESPBaseError {
  /**
   * Creates an instance of `ESPTokenError`.
   *
   * @param code - The error code corresponding to a specific token-related error message
   *               from `tokenErrorMessages`.
   */
  constructor(code: keyof typeof tokenErrorMessages) {
    super(ErrorLabels.ESPTokenError, code, tokenErrorMessages);
  }
}
