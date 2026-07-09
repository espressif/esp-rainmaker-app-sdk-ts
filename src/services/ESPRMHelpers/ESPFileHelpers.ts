/*
 * SPDX-FileCopyrightText: 2026 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ESPFileConfirmParams,
  ESPFileDownloadFormat,
  ESPFileDownloadOptions,
  ESPFileFetchParams,
  ESPFileUpdateParams,
  ESPFileUploadParams,
  ESPFileUploadRequestParams,
} from "../../types/input";
import {
  ESPFileInterface,
  ESPFilePaginatedResultInterface,
  ESPFileUploadRequestInterface,
} from "../../types/ESPModules";
import {
  ESPFileAPIRecord,
  ESPFileConfirmAPIResponse,
  ESPFileListAPIResponse,
  ESPFileUploadRequestAPIResponse,
} from "../../types/output";
import {
  APICallValidationErrorCodes,
  APIEndpoints,
  ErrorLabels,
  FileConstants,
  FileErrorCodes,
  HTTPMethods,
} from "../../utils/constants";
import { ESPAPICallValidationError } from "../../utils/error/Error";
import { ESPFileError } from "../../utils/error/ESPFileError";
import { ESPRMAPIManager } from "../ESPRMAPIManager";

/**
 * Request body for POST `/user/file/upload_confirm`.
 */
export interface ESPFileConfirmRequestBody {
  file_id: string;
  description?: string;
  metadata?: Record<string, unknown>;
  file_type?: string;
  public?: boolean;
}

/**
 * Splits merged upload params into GET query and confirm body parts.
 */
export function splitUploadParams(params: ESPFileUploadParams): {
  requestParams: ESPFileUploadRequestParams;
  confirmParams: ESPFileConfirmParams;
} {
  const {
    fileName,
    entityType,
    entityId,
    md5Checksum,
    description,
    metadata,
    fileType,
    public: isPublic,
  } = params;

  return {
    requestParams: {
      fileName,
      entityType,
      entityId,
      md5Checksum,
    },
    confirmParams: {
      ...(description !== undefined && { description }),
      ...(metadata !== undefined && { metadata }),
      ...(fileType !== undefined && { fileType }),
      ...(isPublic !== undefined && { public: isPublic }),
    },
  };
}

/**
 * Maps a raw file record from the API to the SDK shape.
 */
export function transformFile(record: ESPFileAPIRecord): ESPFileInterface {
  return {
    fileId: record.file_id,
    fileName: record.file_name,
    description: record.description,
    metadata: record.metadata,
    entityType: record.entity_type,
    entityId: record.entity_id,
    fileType: record.file_type,
    timestamp: record.timestamp,
    s3Key: record.s3_key,
    fileMd5: record.file_md5,
    userId: record.user_id,
    userName: record.user_name,
    downloadUrl: record.file_url,
    public: record.public,
  };
}

/**
 * Maps a raw upload-request response to upload-request fields.
 */
export function transformFileUploadRequest(
  response: ESPFileUploadRequestAPIResponse,
  requestParams: ESPFileUploadRequestParams,
  confirmParams: ESPFileConfirmParams = {}
): ESPFileUploadRequestInterface {
  return {
    fileId: response.file_id,
    uploadUrl: response.upload_url ?? response.file_url ?? "",
    fileName: requestParams.fileName,
    entityType: requestParams.entityType,
    entityId: requestParams.entityId,
    md5Checksum: requestParams.md5Checksum,
    confirmParams,
  };
}

/**
 * Validates upload request params and returns the API query object.
 */
export function buildUploadRequestParams(
  params: ESPFileUploadRequestParams
): Record<string, string> {
  validateUploadRequestParams(params);

  const query: Record<string, string> = {
    file_name: params.fileName,
    entity_type: params.entityType,
  };

  if (params.entityId !== undefined) {
    query.entity_id = params.entityId;
  }

  if (params.md5Checksum !== undefined) {
    query.md5_checksum = params.md5Checksum;
  }

  return query;
}

/**
 * Builds the POST body for `/user/file/upload_confirm`.
 */
export function buildConfirmRequestBody(
  fileId: string,
  params: ESPFileConfirmParams
): ESPFileConfirmRequestBody {
  return {
    file_id: fileId,
    ...(params.description !== undefined && {
      description: params.description,
    }),
    ...(params.metadata !== undefined && { metadata: params.metadata }),
    ...(params.fileType !== undefined && { file_type: params.fileType }),
    ...(params.public !== undefined && { public: params.public }),
  };
}

/**
 * Builds query parameters for GET `/user/file`.
 */
export function buildFileListParams(
  params: ESPFileFetchParams,
  startId?: string
): Record<string, unknown> {
  const isSingleFileLookup = params.fileId !== undefined;

  return {
    ...(params.fileId !== undefined && {
      file_id: params.fileId,
    }),
    ...(params.fileName !== undefined && { file_name: params.fileName }),
    ...(params.entityType !== undefined && { entity_type: params.entityType }),
    ...(params.entityId !== undefined && { entity_id: params.entityId }),
    ...(params.fileType !== undefined && { file_type: params.fileType }),
    ...(params.userName !== undefined && { user_name: params.userName }),
    ...(isSingleFileLookup
      ? { num_records: 1 }
      : params.resultCount !== undefined && {
          num_records: params.resultCount,
        }),
    ...(!isSingleFileLookup &&
      startId !== undefined && { start_id: startId }),
    ...(isSingleFileLookup &&
      params.startId !== undefined && { start_id: params.startId }),
  };
}

/**
 * Builds a paginated file list result from a page of records.
 */
export function createFilePaginatedResult(
  files: ESPFileInterface[],
  nextId?: string | null,
  fetchNextPage?: (
    startId: string
  ) => Promise<ESPFilePaginatedResultInterface>
): ESPFilePaginatedResultInterface {
  const cursor = nextId || null;

  return {
    files,
    hasNext: !!cursor,
    ...(cursor &&
      fetchNextPage && {
        fetchNext: () => fetchNextPage(cursor),
      }),
  };
}

/**
 * Normalizes downloaded bytes to the requested format.
 */
export function normalizeDownloadResult(
  buffer: ArrayBuffer,
  format: ESPFileDownloadFormat = "arrayBuffer"
): ArrayBuffer | Uint8Array | Blob {
  switch (format) {
    case "uint8Array":
      return new Uint8Array(buffer);
    case "blob":
      return new Blob([buffer], { type: "application/octet-stream" });
    default:
      return buffer;
  }
}

/**
 * Validates upload content size before sending to S3.
 */
export function validateUploadContentSize(
  content: Blob | ArrayBuffer | Uint8Array
): void {
  const size =
    content instanceof Blob
      ? content.size
      : content.byteLength;

  if (size > FileConstants.MAX_FILE_SIZE_BYTES) {
    throw new ESPAPICallValidationError(
      APICallValidationErrorCodes.FILE_TOO_LARGE
    );
  }
}

function toFetchBody(
  content: Blob | ArrayBuffer | Uint8Array
): Blob | ArrayBuffer {
  if (content instanceof Uint8Array) {
    return new Blob([content as BlobPart]);
  }

  return content;
}

function validateUploadRequestParams(
  params: ESPFileUploadRequestParams
): void {
  if (!params.fileName?.trim()) {
    throw new ESPAPICallValidationError(
      APICallValidationErrorCodes.MISSING_FILE_NAME
    );
  }

  if (
    params.fileName.length < 1 ||
    params.fileName.length > FileConstants.MAX_FILE_NAME_LENGTH
  ) {
    throw new ESPAPICallValidationError(
      APICallValidationErrorCodes.INVALID_FILE_NAME
    );
  }

  if (!params.entityType?.trim()) {
    throw new ESPAPICallValidationError(
      APICallValidationErrorCodes.MISSING_FILE_ENTITY_TYPE
    );
  }

  if (
    params.entityType === FileConstants.OTA_IMAGE_ENTITY_TYPE &&
    !params.entityId?.trim()
  ) {
    throw new ESPAPICallValidationError(
      APICallValidationErrorCodes.MISSING_FILE_ENTITY_ID
    );
  }
}

/**
 * GET `/user/file/upload_request` to obtain a presigned upload URL.
 */
export async function fetchFileUploadRequest(
  params: ESPFileUploadRequestParams,
  confirmParams: ESPFileConfirmParams = {}
): Promise<ESPFileUploadRequestInterface> {
  const response: ESPFileUploadRequestAPIResponse =
    await ESPRMAPIManager.authorizeRequest({
      url: APIEndpoints.USER_FILE_UPLOAD_REQUEST,
      method: HTTPMethods.GET,
      params: buildUploadRequestParams(params),
    });

  return transformFileUploadRequest(response, params, confirmParams);
}

/**
 * PUT file bytes to a presigned S3 upload URL.
 */
export async function uploadToPresignedUrl(
  url: string,
  content: Blob | ArrayBuffer | Uint8Array,
  md5Checksum?: string
): Promise<void> {
  validateUploadContentSize(content);

  const headers: Record<string, string> = {
    "Content-Type": "application/octet-stream",
  };

  if (md5Checksum !== undefined) {
    headers["Content-MD5"] = md5Checksum;
  }

  const response = await fetch(url, {
    method: HTTPMethods.PUT,
    headers,
    body: toFetchBody(content),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new ESPFileError(
      ErrorLabels.ESPFileUploadError,
      FileErrorCodes.S3_UPLOAD_FAILED,
      { status: response.status, body }
    );
  }
}

/**
 * GET file bytes from a presigned S3 download URL.
 */
export async function downloadFromPresignedUrl(
  url: string,
  options?: ESPFileDownloadOptions
): Promise<ArrayBuffer> {
  const response = await fetch(url, {
    method: HTTPMethods.GET,
    signal: options?.signal,
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new ESPFileError(
      ErrorLabels.ESPFileDownloadError,
      FileErrorCodes.S3_DOWNLOAD_FAILED,
      { status: response.status, body }
    );
  }

  return response.arrayBuffer();
}

/**
 * POST `/user/file/upload_confirm` after uploading to S3.
 */
export async function confirmFileUpload(
  fileId: string,
  params: ESPFileConfirmParams
): Promise<ESPFileInterface> {
  const response: ESPFileConfirmAPIResponse =
    await ESPRMAPIManager.authorizeRequest({
      url: APIEndpoints.USER_FILE_UPLOAD_CONFIRM,
      method: HTTPMethods.POST,
      data: buildConfirmRequestBody(fileId, params),
    });

  const refreshed = await fetchFileList({ fileId });
  const record = refreshed.files[0];

  if (record) {
    return record;
  }

  return {
    fileId: response.file_id,
    downloadUrl: response.file_url,
    ...(params.description !== undefined && {
      description: params.description,
    }),
    ...(params.metadata !== undefined && { metadata: params.metadata }),
    ...(params.fileType !== undefined && { fileType: params.fileType }),
    ...(params.public !== undefined && { public: params.public }),
  };
}

/**
 * GET `/user/file` with optional filters and cursor pagination.
 */
export async function fetchFileList(
  params: ESPFileFetchParams = {}
): Promise<ESPFilePaginatedResultInterface> {
  if (params.fileId !== undefined) {
    const response: ESPFileListAPIResponse =
      await ESPRMAPIManager.authorizeRequest({
        url: APIEndpoints.USER_FILE,
        method: HTTPMethods.GET,
        params: buildFileListParams(params),
      });

    const files = (response.file_details ?? []).map(transformFile);

    return {
      files,
      hasNext: false,
    };
  }

  const fetchPage = async (
    startId?: string
  ): Promise<ESPFilePaginatedResultInterface> => {
    const response: ESPFileListAPIResponse =
      await ESPRMAPIManager.authorizeRequest({
        url: APIEndpoints.USER_FILE,
        method: HTTPMethods.GET,
        params: buildFileListParams(params, startId),
      });

    const files = (response.file_details ?? []).map(transformFile);

    return createFilePaginatedResult(
      files,
      response.next_id,
      fetchPage
    );
  };

  return fetchPage();
}

/**
 * PUT `/user/file` to update public status.
 */
export async function updateFile(
  fileId: string,
  params: ESPFileUpdateParams
): Promise<void> {
  await ESPRMAPIManager.authorizeRequest({
    url: APIEndpoints.USER_FILE,
    method: HTTPMethods.PUT,
    params: { file_id: fileId },
    data: {
      ...(params.public !== undefined && { public: params.public }),
    },
  });
}

/**
 * DELETE `/user/file` to remove an uploaded file.
 */
export async function deleteFile(fileId: string): Promise<void> {
  await ESPRMAPIManager.authorizeRequest({
    url: APIEndpoints.USER_FILE,
    method: HTTPMethods.DELETE,
    params: { file_id: fileId },
  });
}
