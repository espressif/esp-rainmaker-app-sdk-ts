/*
 * SPDX-FileCopyrightText: 2026 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMAPIManager } from "../ESPRMAPIManager";
import { ESPCmdRespRequest } from "../../ESPCmdRespRequest";
import {
  ESPCmdRespCancelRequest,
  ESPCmdRespListParams,
  ESPCmdRespSendRequest,
} from "../../types/input";
import { ESPCmdRespRequestInterface } from "../../types/ESPModules";
import {
  ESPCmdRespCancelAPIResponse,
  ESPCmdRespCancelResponse,
  ESPCmdRespListAPIResponse,
  ESPCmdRespPaginatedResult,
  ESPCmdRespRequestAPIRecord,
  ESPCmdRespSendAPIRawResponse,
  ESPCmdRespSendAPIResponse,
  ESPCmdRespSendAPIResponseEntry,
  ESPCmdRespSendAPIResponseEntryRaw,
  ESPCmdRespSendAPINodeResponse,
  ESPCmdRespSendAPINodeResponseRaw,
} from "../../types/output";
import {
  APICallValidationErrorCodes,
  APIEndpoints,
  CommandResponseConstants,
  HTTPMethods,
} from "../../utils/constants";
import { ESPAPICallValidationError } from "../../utils/error/Error";

/**
 * Request body for POST `/user/nodes/cmd`.
 */
export interface ESPCmdRespSendRequestBody {
  /** Target node ids (1–25 unique values). */
  node_ids: string[];
  /** Command id in the range 0–65535. */
  cmd: number;
  /** Command payload as a string or JSON object. */
  data: Record<string, unknown> | string;
  /** Request timeout in seconds, or `-1` for no timeout. */
  timeout?: number;
  /** When true, `data` is treated as base64-encoded. */
  is_base64?: boolean;
  /** When true, overrides an existing pending command for the same node/cmd. */
  override?: boolean;
}

/**
 * Maps a raw per-node 207 reply entry from the API to the SDK shape.
 */
export function transformCmdRespSendNodeResponse(
  response: ESPCmdRespSendAPINodeResponseRaw
): ESPCmdRespSendAPINodeResponse {
  return {
    status: response.status,
    ...(response.error_code !== undefined && {
      errorCode: response.error_code,
    }),
    ...(response.description !== undefined && {
      description: response.description,
    }),
  };
}

/**
 * Maps a raw 207 response entry from the API to the SDK shape.
 */
export function transformCmdRespSendResponseEntry(
  entry: ESPCmdRespSendAPIResponseEntryRaw
): ESPCmdRespSendAPIResponseEntry {
  return {
    nodeIds: entry.node_ids,
    response: transformCmdRespSendNodeResponse(entry.response),
  };
}

/**
 * Maps a raw command-response send response from the API to the SDK shape.
 */
export function transformCmdRespSendResponse(
  response: ESPCmdRespSendAPIRawResponse
): ESPCmdRespSendAPIResponse {
  return {
    requestId: response.request_id,
    status: response.status,
    ...(response.responses !== undefined && {
      responses: response.responses.map(transformCmdRespSendResponseEntry),
    }),
  };
}

/**
 * Maps a raw command-response cancel response from the API to the SDK shape.
 */
export function transformCmdRespCancelResponse(
  response: ESPCmdRespCancelAPIResponse
): ESPCmdRespCancelResponse {
  return {
    status: response.status,
    totalCancelled: response.total_cancelled,
  };
}

/**
 * Maps a raw command-response request record from the API to the SDK shape.
 */
export function transformCmdRespRequest(
  record: ESPCmdRespRequestAPIRecord
): ESPCmdRespRequestInterface {
  return {
    requestId: record.request_id,
    status: record.status,
    nodeId: record.node_id,
    deviceStatus: record.device_status,
    statusDescription: record.status_description,
    requestData: record.request_data,
    responseData: record.response_data,
    requestDataError: record.request_data_error,
    responseDataError: record.response_data_error,
    isBase64: record.is_base64,
    userName: record.user_name,
    indefiniteTimeout: record.indefinite_timeout,
    requestTimestamp: record.request_timestamp,
    responseTimestamp: record.response_timestamp,
    expirationTimestamp: record.expiration_timestamp,
    cmdId: record.cmd,
  };
}

/**
 * Validates send-command input and builds the POST body for `/user/nodes/cmd`.
 *
 * @param params - Target nodes, command id, payload, and optional options.
 * @returns API-ready request body with snake_case fields.
 * @throws {@link ESPAPICallValidationError} When node ids, cmd id, data size,
 *   or timeout are invalid.
 */
export function buildCmdRespRequestBody(
  params: ESPCmdRespSendRequest
): ESPCmdRespSendRequestBody {
  const nodeIds = validateNodeIds(params.nodeIds);
  const cmd = validateCommandId(params.cmdId);
  const data = params.data;

  if (
    typeof data === "string" &&
    data.length > CommandResponseConstants.MAX_DATA_LENGTH
  ) {
    throw new ESPAPICallValidationError(
      APICallValidationErrorCodes.COMMAND_DATA_TOO_LARGE
    );
  }

  if (params.timeoutSeconds !== undefined) {
    validateTimeout(params.timeoutSeconds);
  }

  const body: ESPCmdRespSendRequestBody = { node_ids: nodeIds, cmd, data };

  if (params.timeoutSeconds !== undefined) {
    body.timeout = params.timeoutSeconds;
  }

  if (params.isBase64 !== undefined) {
    body.is_base64 = params.isBase64;
  }

  if (params.override !== undefined) {
    body.override = params.override;
  }

  return body;
}

/**
 * Validates the command id.
 *
 * @param cmd - Command id (0–65535) registered on the firmware.
 * @returns The validated command id.
 * @throws {@link ESPAPICallValidationError} When `cmd` is out of range.
 */
function validateCommandId(cmd: number): number {
  if (
    !Number.isInteger(cmd) ||
    cmd < 0 ||
    cmd > CommandResponseConstants.MAX_CMD_ID
  ) {
    throw new ESPAPICallValidationError(
      APICallValidationErrorCodes.INVALID_COMMAND_ID
    );
  }

  return cmd;
}

/**
 * Validates a command timeout value.
 *
 * @param timeoutSeconds - Timeout in seconds, or `-1` for no timeout.
 * @throws {@link ESPAPICallValidationError} When the value is out of range.
 */
function validateTimeout(timeoutSeconds: number): void {
  if (
    timeoutSeconds !== -1 &&
    (!Number.isInteger(timeoutSeconds) ||
      timeoutSeconds < CommandResponseConstants.MIN_TIMEOUT_SECONDS ||
      timeoutSeconds > CommandResponseConstants.MAX_TIMEOUT_SECONDS)
  ) {
    throw new ESPAPICallValidationError(
      APICallValidationErrorCodes.INVALID_COMMAND_TIMEOUT
    );
  }
}

/**
 * Validates node ids for a send-command request.
 *
 * @param nodeIds - One to 25 unique node ids.
 * @returns Deduplicated node ids.
 * @throws {@link ESPAPICallValidationError} When count or uniqueness is invalid.
 */
function validateNodeIds(nodeIds: string[]): string[] {
  if (
    nodeIds.length < 1 ||
    nodeIds.length > CommandResponseConstants.MAX_NODE_IDS
  ) {
    throw new ESPAPICallValidationError(
      APICallValidationErrorCodes.INVALID_COMMAND_NODE_IDS
    );
  }

  const unique = [...new Set(nodeIds)];
  if (unique.length !== nodeIds.length) {
    throw new ESPAPICallValidationError(
      APICallValidationErrorCodes.DUPLICATE_COMMAND_NODE_IDS
    );
  }

  return unique;
}

/**
 * Builds query parameters for GET `/user/nodes/cmd`.
 *
 * @param params - Filter and pagination options.
 * @param startId - Optional cursor (`start_id`) for the next page.
 * @returns Snake_case query parameters for the API request.
 */
export function createCmdRespRequestListParams(
  params: ESPCmdRespListParams,
  startId?: string
): Record<string, unknown> {
  const query: Record<string, unknown> = {};

  if (params.requestId !== undefined) {
    query.request_id = params.requestId;
  }
  if (params.nodeId !== undefined) {
    query.node_id = params.nodeId;
  }
  if (params.status !== undefined) {
    query.status = params.status;
  }
  if (params.startTime !== undefined) {
    query.start_time = params.startTime;
  }
  if (params.endTime !== undefined) {
    query.end_time = params.endTime;
  }
  if (params.cmdId !== undefined) {
    query.cmd_id = params.cmdId;
  }
  if (params.descOrder !== undefined) {
    query.desc_order = params.descOrder;
  }
  if (params.resultCount !== undefined) {
    query.num_records = params.resultCount;
  }
  if (startId !== undefined) {
    query.start_id = startId;
  }

  return query;
}

/**
 * Builds query parameters for DELETE `/user/nodes/cmd`.
 *
 * @param params - Cancellation filters (`requestId`, `nodeId`, and/or `cmdId`).
 * @returns Snake_case query parameters for the API request.
 */
export function createCmdRespRequestCancelParams(
  params: ESPCmdRespCancelRequest
): Record<string, unknown> {
  const query: Record<string, unknown> = {};

  if (params.requestId !== undefined) {
    query.request_id = params.requestId;
  }
  if (params.nodeId !== undefined) {
    query.node_id = params.nodeId;
  }
  if (params.cmdId !== undefined) {
    query.cmd_id = params.cmdId;
  }

  return query;
}

/**
 * Builds a paginated command-response result from a page of requests.
 *
 * When `nextId` is present and `fetchNextPage` is provided, the response
 * includes a `fetchNext` callback that continues from that cursor.
 *
 * @param requests - Transformed request records for the current page.
 * @param nextId - Optional pagination cursor from the API (`next_id`).
 * @param fetchNextPage - Fetches the next page using the cursor.
 * @returns Paginated command-response request records.
 */
export function createCmdRespRequestPaginatedResult(
  requests: ESPCmdRespRequest[],
  nextId?: string | null,
  fetchNextPage?: (startId: string) => Promise<ESPCmdRespPaginatedResult>
): ESPCmdRespPaginatedResult {
  const cursor = nextId || null;
  const result: ESPCmdRespPaginatedResult = {
    requests,
    hasNext: !!cursor,
  };

  if (cursor && fetchNextPage) {
    result.fetchNext = () => fetchNextPage(cursor);
  }

  return result;
}

/**
 * POST `/user/nodes/cmd` to queue a command-response request.
 *
 * @param params - Target nodes, payload, and optional command options.
 * @returns The creation response (200 OK or 207 Multi-Status).
 */
export async function createCmdRespRequest(
  params: ESPCmdRespSendRequest
): Promise<ESPCmdRespSendAPIResponse> {
  const requestConfig = {
    url: APIEndpoints.USER_NODE_CMD,
    method: HTTPMethods.POST,
    data: buildCmdRespRequestBody(params),
  };
  const result = (await ESPRMAPIManager.authorizeRequest(
    requestConfig
  )) as ESPCmdRespSendAPIRawResponse;
  return transformCmdRespSendResponse(result);
}

/**
 * GET `/user/nodes/cmd` with optional filters and cursor pagination.
 *
 * @param params - Filter and pagination options.
 * @returns Paginated command-response request records.
 */
export async function fetchCmdRespRequestList(
  params: ESPCmdRespListParams
): Promise<ESPCmdRespPaginatedResult> {
  const fetchPage = async (
    startId?: string
  ): Promise<ESPCmdRespPaginatedResult> => {
    const response: ESPCmdRespListAPIResponse =
      await ESPRMAPIManager.authorizeRequest({
        url: APIEndpoints.USER_NODE_CMD,
        method: HTTPMethods.GET,
        params: createCmdRespRequestListParams(params, startId),
      });

    const requests = (response.requests ?? []).map(
      (record) => new ESPCmdRespRequest(transformCmdRespRequest(record))
    );

    return createCmdRespRequestPaginatedResult(
      requests,
      response.next_id,
      fetchPage
    );
  };

  return fetchPage();
}

/**
 * GET `/user/nodes/cmd` for request(s) by id.
 *
 * When `nodeId` is omitted, a multi-node send may return one record per node
 * for the same `requestId`. Pass `nodeId` to scope to a single node.
 *
 * @param requestId - The request id returned by `createCmdRespRequest`.
 * @param nodeId - Optional node scope; omit to look up by request id alone.
 * @returns Matching request records (empty when the backend has no match).
 */
export async function fetchCmdRespRequestById(
  requestId: string,
  nodeId?: string
): Promise<ESPCmdRespRequest[]> {
  const payload: ESPCmdRespListParams = { requestId };

  if (nodeId) {
    payload.nodeId = nodeId;
  }

  const response: ESPCmdRespListAPIResponse =
    await ESPRMAPIManager.authorizeRequest({
      url: APIEndpoints.USER_NODE_CMD,
      method: HTTPMethods.GET,
      params: createCmdRespRequestListParams(payload),
    });

  return (response.requests ?? []).map(
    (r) => new ESPCmdRespRequest(transformCmdRespRequest(r))
  );
}

/**
 * DELETE `/user/nodes/cmd` to cancel pending command-response request(s).
 *
 * @param params - Cancellation filters (`requestId`, `nodeId`, and/or `cmdId`).
 * @returns Cancellation status and count of removed requests.
 */
export async function cancelCmdRespRequest(
  params: ESPCmdRespCancelRequest
): Promise<ESPCmdRespCancelResponse> {
  if (params.requestId === undefined && params.nodeId === undefined) {
    throw new ESPAPICallValidationError(
      APICallValidationErrorCodes.CANCEL_MISSING_REQUIRED_PARAM
    );
  }

  if (params.cmdId !== undefined && params.nodeId === undefined) {
    throw new ESPAPICallValidationError(
      APICallValidationErrorCodes.CANCEL_CMD_ID_REQUIRES_NODE_ID
    );
  }

  const result = (await ESPRMAPIManager.authorizeRequest({
    url: APIEndpoints.USER_NODE_CMD,
    method: HTTPMethods.DELETE,
    params: createCmdRespRequestCancelParams(params),
  })) as ESPCmdRespCancelAPIResponse;

  return transformCmdRespCancelResponse(result);
}
