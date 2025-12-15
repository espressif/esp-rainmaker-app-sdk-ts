/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ErrorLabels } from "../constants";
import { defaultErrorMessages, claimErrorMessages } from "./errorMessages";
import { ESPBaseError } from "./ESPBaseError";

/**
 * Represents an error related to claiming issues.
 *
 * This class extends `ESPBaseError` and is used to handle errors that occur
 * during the device claiming process, such as certificate generation and device claiming.
 *
 * @extends ESPBaseError
 */
export class ESPClaimError extends ESPBaseError {
  /**
   * Creates an instance of `ESPClaimError`.
   *
   * @param code - The error code corresponding to a specific claiming error message
   *               from `claimErrorMessages`.
   */
  constructor(code: keyof typeof claimErrorMessages) {
    super(
      ErrorLabels.ESPClaimError,
      code,
      claimErrorMessages,
      defaultErrorMessages.CLAIM_ERROR
    );
  }
}
