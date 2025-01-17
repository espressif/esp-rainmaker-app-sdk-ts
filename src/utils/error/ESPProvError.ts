/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ErrorLabels } from "../constants";
import { defaultErrorMessages, provErrorMessages } from "./errorMessages";
import { ESPBaseError } from "./ESPBaseError";

/**
 * Represents an error related to provisioning issues.
 *
 * This class extends `ESPBaseError` and is used to handle errors that occur
 * during the provisioning process, such as device setup or user-device association.
 *
 * @extends ESPBaseError
 */
export class ESPProvError extends ESPBaseError {
  /**
   * Creates an instance of `ESPProvError`.
   *
   * @param code - The error code corresponding to a specific provisioning error message
   *               from `provErrorMessages`.
   */
  constructor(code: keyof typeof provErrorMessages) {
    super(
      ErrorLabels.ESPProvError,
      code,
      provErrorMessages,
      defaultErrorMessages.PROVISION_ERROR
    );
  }
}
