/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ErrorLabels } from "../constants";
import { appPermissionErrorMessages } from "./errorMessages";
import { ESPBaseError } from "./ESPBaseError";

/**
 * Represents an error related to app permission issues.
 *
 * This class extends `ESPBaseError` and is used to handle errors that occur
 * during the app permission process, such as BLE permission, location permission, or local control permission.
 *
 * @extends ESPBaseError
 */
export class ESPAppPermissionError extends ESPBaseError {
  /**
   * Creates an instance of `ESPAppPermissionError`.
   *
   * @param code - The error code corresponding to a specific permission error message
   *               from `appPermissionErrorMessages`.
   */
  constructor(code: keyof typeof appPermissionErrorMessages) {
    super(ErrorLabels.ESPAppPermissionError, code, appPermissionErrorMessages);
  }
}
