/*
 * SPDX-FileCopyrightText: 2026 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ErrorLabels } from "../constants";
import { fileErrorMessages } from "./errorMessages";
import { ESPBaseError } from "./ESPBaseError";

/** Labels used to distinguish file error kinds. */
type ESPFileErrorLabel =
  | typeof ErrorLabels.ESPFileNotFoundError
  | typeof ErrorLabels.ESPFileUploadError
  | typeof ErrorLabels.ESPFileDownloadError;

/**
 * Represents an error related to file operations.
 *
 * This class extends `ESPBaseError` and uses labels to distinguish
 * between file-not-found, file-upload, and file-download failures.
 *
 * @extends ESPBaseError
 */
export class ESPFileError extends ESPBaseError {
  /** The file id when the error is a not-found failure. */
  readonly fileId?: string;

  /** HTTP status code when the failure originated from an S3 response. */
  readonly status?: number;

  /**
   * S3 REST error response body (typically XML) when the failure
   * originated from a presigned URL request.
   */
  readonly body?: string;

  /**
   * Creates an instance of `ESPFileError`.
   *
   * @param label - The label distinguishing not-found, upload, or download errors.
   * @param code - The error code corresponding to a specific file error
   *               message from `fileErrorMessages`.
   * @param options - Optional contextual details for the error.
   */
  constructor(
    label: ESPFileErrorLabel,
    code: keyof typeof fileErrorMessages,
    options?: {
      fileId?: string;
      status?: number;
      body?: string;
    }
  ) {
    super(label, code, fileErrorMessages);
    this.fileId = options?.fileId;
    this.status = options?.status;
    this.body = options?.body;

    if (options?.status !== undefined) {
      const bodySuffix =
        options.body !== undefined && options.body.length > 0
          ? ` ${options.body}`
          : "";
      this.message = `${this.message} ${options.status}${bodySuffix}`;
    }
  }
}
