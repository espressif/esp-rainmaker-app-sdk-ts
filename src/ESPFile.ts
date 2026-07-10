/*
 * SPDX-FileCopyrightText: 2026 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  deleteFile,
  downloadFromPresignedUrl,
  fetchFileList,
  normalizeDownloadResult,
  updateFile,
} from "./services/ESPRMHelpers/ESPFileHelpers";
import {
  ESPFileDownloadOptions,
  ESPFileDownloadResult,
  ESPFileUpdateParams,
} from "./types/input";
import { ESPFileInterface } from "./types/ESPModules";
import { ErrorLabels, FileErrorCodes } from "./utils/constants";
import { ESPFileError } from "./utils/error/ESPFileError";

/**
 * Represents an uploaded file in the ESP RainMaker SDK.
 *
 * Returned by upload confirm, list, and lookup helpers. Use {@link refresh}
 * to fetch the latest metadata, {@link download} to fetch file bytes, and
 * {@link updatePublic} to change visibility.
 */
export class ESPFile implements ESPFileInterface {
  /** The unique file id. */
  fileId!: string;

  /** RainMaker-side file name. */
  fileName?: string;

  /** User-provided description. */
  description?: string;

  /** Optional metadata attached at confirm time. */
  metadata?: Record<string, unknown> | string;

  /** Entity type the file is associated with. */
  entityType?: string;

  /** Entity id the file is associated with. */
  entityId?: string;

  /** Custom file type label. */
  fileType?: string;

  /** Hex MD5 checksum of the file content. */
  fileMd5?: string;

  /** Upload timestamp from the backend. */
  timestamp?: string;

  /** S3 object key. */
  s3Key?: string;

  /** Owner user id from the backend. */
  userId?: string;

  /** Owner username from the backend. */
  userName?: string;

  /** Presigned download URL when available. */
  downloadUrl?: string;

  /** Whether the file is public. */
  public?: boolean;

  /**
   * Creates an instance of `ESPFile`.
   *
   * @param data - File record fields.
   */
  constructor(data: ESPFileInterface) {
    this.applyUpdate(data);
  }

  /**
   * Fetches the latest file metadata from the cloud and updates this instance.
   *
   * @returns This instance with refreshed fields, or `null` when no record exists.
   */
  async refresh(): Promise<ESPFile | null> {
    const result = await fetchFileList({ fileId: this.fileId });
    const record = result.files[0];

    if (!record) {
      return null;
    }

    this.applyUpdate(record);
    return this;
  }

  /**
   * Downloads file bytes from the presigned download URL.
   *
   * @param options - Download options including format and abort signal.
   * @returns File content in the requested format.
   */
  async download(
    options?: ESPFileDownloadOptions
  ): Promise<ESPFileDownloadResult> {
    let url = this.downloadUrl;

    if (!url && options?.refreshIfNeeded !== false) {
      await this.refresh();
      url = this.downloadUrl;
    }

    if (!url) {
      throw new ESPFileError(
        ErrorLabels.ESPFileDownloadError,
        FileErrorCodes.NO_DOWNLOAD_URL
      );
    }

    const buffer = await downloadFromPresignedUrl(url, options);
    return normalizeDownloadResult(buffer, options?.format);
  }

  /**
   * Returns the cached presigned download URL without network I/O.
   *
   * @returns The download URL when known.
   */
  getDownloadUrl(): string | undefined {
    return this.downloadUrl;
  }

  /**
   * Updates file metadata such as public visibility.
   *
   * @param params - Fields to update.
   * @returns This instance with refreshed fields from the backend.
   */
  async update(params: ESPFileUpdateParams): Promise<ESPFile> {
    await updateFile(this.fileId, params);
    const refreshed = await this.refresh();
    return refreshed ?? this;
  }

  /**
   * Sets whether this file is public.
   *
   * @param isPublic - `true` to make the file public.
   * @returns This instance with refreshed fields from the backend.
   */
  async updatePublic(isPublic: boolean): Promise<ESPFile> {
    return this.update({ public: isPublic });
  }

  /**
   * Deletes this uploaded file from RainMaker.
   */
  async delete(): Promise<void> {
    await deleteFile(this.fileId);
  }

  private applyUpdate(data: ESPFileInterface): void {
    this.fileId = data.fileId;
    this.fileName = data.fileName;
    this.description = data.description;
    this.metadata = data.metadata;
    this.entityType = data.entityType;
    this.entityId = data.entityId;
    this.fileType = data.fileType;
    this.fileMd5 = data.fileMd5;
    this.timestamp = data.timestamp;
    this.s3Key = data.s3Key;
    this.userId = data.userId;
    this.userName = data.userName;
    this.downloadUrl = data.downloadUrl;
    this.public = data.public;
  }
}
