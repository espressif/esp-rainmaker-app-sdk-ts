/*
 * SPDX-FileCopyrightText: 2026 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  confirmFileUpload,
  uploadToPresignedUrl,
} from "./services/ESPRMHelpers/ESPFileHelpers";
import {
  ESPFileConfirmParams,
  ESPFileUploadProgressCallback,
  ESPFileUploadProgressStatus,
} from "./types/input";
import { ESPFileUploadRequestInterface } from "./types/ESPModules";
import { ESPFile } from "./ESPFile";
import { ESPFileUploadProgressMessages } from "./utils/constants";

/**
 * Represents a transient file upload request in the ESP RainMaker SDK.
 *
 * Returned by {@link ESPRMUser.createFileUploadRequest} and
 * {@link ESPRMUser.uploadFile}. Use {@link upload} to send bytes to S3 and
 * confirm the upload, or {@link confirm} after an external upload.
 */
export class ESPFileUploadRequest implements ESPFileUploadRequestInterface {
  /** The unique file id returned when the upload request was created. */
  fileId!: string;

  /** Presigned S3 PUT URL (valid for ~1 hour). */
  uploadUrl!: string;

  /** RainMaker-side file name from the upload request. */
  fileName!: string;

  /** Entity type associated with the upload. */
  entityType!: string;

  /** Entity id when scoped to a specific entity. */
  entityId?: string;

  /** Optional base64 MD5 checksum used for S3 integrity verification. */
  md5Checksum?: string;

  /** Confirm metadata stored from create/upload params. */
  confirmParams!: ESPFileConfirmParams;

  /**
   * Creates an instance of `ESPFileUploadRequest`.
   *
   * @param data - Upload request fields.
   */
  constructor(data: ESPFileUploadRequestInterface) {
    this.applyUpdate(data);
  }

  /**
   * Uploads file content to S3 and automatically confirms the upload.
   *
   * @param content - File bytes to upload.
   * @param confirmParams - Optional confirm fields overriding stored values.
   * @param onProgress - Optional phase progress callback.
   * @returns The confirmed {@link ESPFile} record.
   */
  async upload(
    content: Blob | ArrayBuffer | Uint8Array,
    confirmParams?: ESPFileConfirmParams,
    onProgress?: ESPFileUploadProgressCallback
  ): Promise<ESPFile> {
    onProgress?.({
      status: ESPFileUploadProgressStatus.uploading,
      message: ESPFileUploadProgressMessages.UPLOADING,
    });

    await uploadToPresignedUrl(this.uploadUrl, content, this.md5Checksum);

    onProgress?.({
      status: ESPFileUploadProgressStatus.confirming,
      message: ESPFileUploadProgressMessages.CONFIRMING,
    });

    return this.confirm(confirmParams);
  }

  /**
   * Confirms a file upload after bytes were sent to the presigned URL.
   *
   * @param params - Optional confirm fields overriding stored values.
   * @returns The confirmed {@link ESPFile} record.
   */
  async confirm(params?: ESPFileConfirmParams): Promise<ESPFile> {
    const body = { ...this.confirmParams, ...params };
    return new ESPFile(await confirmFileUpload(this.fileId, body));
  }

  private applyUpdate(data: ESPFileUploadRequestInterface): void {
    this.fileId = data.fileId;
    this.uploadUrl = data.uploadUrl;
    this.fileName = data.fileName;
    this.entityType = data.entityType;
    this.entityId = data.entityId;
    this.md5Checksum = data.md5Checksum;
    this.confirmParams = data.confirmParams;
  }
}
