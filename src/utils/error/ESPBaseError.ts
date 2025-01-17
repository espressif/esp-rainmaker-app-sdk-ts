/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { defaultErrorMessages } from "./errorMessages";

/**
 * Base class for creating custom errors.
 */
export class ESPBaseError extends Error {
  /** The specific error code associated with the error. */
  public code: string;

  /** A label to classify the error type. */
  public label: string;

  /**
   * Constructs a new `ESPBaseError`.
   *
   * @param label - A label representing the error type.
   * @param code - A key corresponding to a specific error message from the provided error messages object.
   * @param errorMessages - An object mapping error codes to their corresponding error messages.
   * @param defaultMessage - A default message if the code is not found in the error messages.
   */
  constructor(
    label: string,
    code: string,
    errorMessages: Record<string, string>,
    defaultMessage = defaultErrorMessages.UNKNOWN_ERROR
  ) {
    const message = errorMessages[code] || defaultMessage;
    super(message);
    this.label = label;
    this.code = code;
  }
}
