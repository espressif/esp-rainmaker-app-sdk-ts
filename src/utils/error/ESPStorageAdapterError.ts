/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ErrorLabels } from "../constants";
import { storageAdapterErrorMessages } from "./errorMessages";
import { ESPBaseError } from "./ESPBaseError";

/**
 * Represents an error related to the storage adapter.
 *
 * This class extends `ESPBaseError` and is used to handle errors that arise
 * due to issues with the storage adapter configuration or functionality.
 *
 * @extends ESPBaseError
 */
export class ESPStorageAdapterError extends ESPBaseError {
  /**
   * Creates an instance of `ESPStorageAdapterError`.
   *
   * @param code - The error code corresponding to a specific storage adapter error
   *               message from `storageAdapterErrorMessages`.
   */
  constructor(code: keyof typeof storageAdapterErrorMessages) {
    super(
      ErrorLabels.ESPStorageAdapterError,
      code,
      storageAdapterErrorMessages
    );
  }
}
