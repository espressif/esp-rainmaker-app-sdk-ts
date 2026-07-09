/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPCmdRespDataError, ESPCmdRespDeviceStatus, ESPCmdRespRequestInterface, ESPCmdRespRequestStatus } from "./ESPModules";

import { ESPGroupSharingRequest } from "../ESPGroupSharingRequest";
import { ESPNodeSharingRequest } from "../ESPNodeSharingRequest";
import { ESPRMGroup } from "../ESPRMGroup";
import { ESPRMNode } from "../ESPRMNode";
import { ESPFile } from "../ESPFile";

/**
 * Represents a response from the API, which can be either a success or failure.
 */
interface ESPAPIResponse {
  status: string;
  description: string;
}

/**
 * Represents a error response from the API.
 */
interface ESPAPIError extends ESPAPIResponse {
  statusCode: number;
  errorCode: string;
  additionalInfo?: string | string[];
}

/**
 * Represents the response from a login attempt with a password.
 */
interface LoginWithPasswordResponse extends ESPAPIResponse {
  idtoken: string;
  accesstoken: string;
  refreshtoken: string;
}

/**
 * Represents the response from requesting a login OTP.
 */
interface RequestLoginOTPResponse extends ESPAPIResponse {
  session: string;
}

/**
 * Represents the response from a login attempt with OTP.
 */
interface LoginWithOTPResponse extends LoginWithPasswordResponse { }

/**
 * Represents detailed user information.
 */
interface GetUserInfoResponse {
  user_id: string;
  user_name: string;
  mfa: boolean;
  super_admin?: boolean;
  picture_url?: string;
  name?: string;
  phone_number?: string;
  custom_data?: Record<string, any>;
  tags?: string[];
}

/**
 * Represents transformed user information for internal use.
 */
interface ESPRMUserInfo {
  userId: string;
  username: string;
  mfa: boolean;
  superAdmin?: boolean;
  pictureUrl?: string;
  name?: string;
  phoneNumber?: string;
  customData?: Record<string, any>;
  tags?: string[];
}

/**
 * Represents the response for extending a session, excluding the refresh token.
 */
interface ExtendSessionResponse
  extends Omit<LoginWithPasswordResponse, "refreshtoken"> { }

/**
 * Represents the response from logging in with an OAuth code.
 */
interface LoginWithOauthCodeResponse {
  id_token: string;
  access_token: string;
  refresh_token: string;
}

/**
 * Represents the backend response for new group creation.
 */
interface CreateGroupAPIResponse {
  group_id: string;
  status: string;
}

/**
 * Represents the backend response for new sub-group creation.
 */
interface CreateSubGroupAPIResponse extends CreateGroupAPIResponse { }

/**
 * Represents the backend response for user groups.
 */
interface GetGroupsAPIResponse {
  groups: Record<string, any>[];
  total: string;
  next_id: string;
}

/**
 * Represents the processed paginated response for user groups.
 */
interface GetGroupsResponse {
  groups: ESPRMGroup[];
  total: string;
  nextId: string;
}

/**
 * Represents the backend response for user nodes.
 */
interface GetNodesAPIResponse {
  nodes: string[];
  node_details: Record<string, any>[];
  total: number;
  next_id: string;
}

/**
 * Represents the processed paginated response for user nodes.
 */
interface ESPPaginatedNodesResponse {
  nodes: ESPRMNode[];
  hasNext: boolean;
  fetchNext?: () => Promise<ESPPaginatedNodesResponse>;
}

/**
 * Represents the backend response for user node detail.
 */
interface GetNodeDeatailsAPIResponse {
  nodes: string[];
  node_details: Record<string, any>[];
  total: number;
}

/**
 * Represents the backend response for user node sharing requests/invitations.
 */
interface GetNodeSharingRequestsAPIResponse {
  sharing_requests: Record<string, any>[];
  next_request_id?: string;
  next_user_name?: string;
}

interface GetGroupSharingRequestsAPIResponse {
  sharing_requests: Record<string, any>[];
  next_request_id?: string;
  next_user_name?: string;
}

/**
 * Represents the response from assuming a user role.
 */
interface AssumeRoleResponse {
  accessKey: string;
  secretKey: string;
  sessionToken: string;
}

/**
 * Represents the processed paginated response for user node sharing requests/invitations.
 */
interface ESPNodeSharingResponse {
  sharedRequests: ESPNodeSharingRequest[];
  hasNext: boolean;
  fetchNext?: () => Promise<ESPNodeSharingResponse>;
}

/**
 * Represents the processed paginated response for user groups.
 */
interface ESPPaginatedGroupsResponse {
  groups: ESPRMGroup[];
  hasNext: boolean;
  fetchNext?: () => Promise<ESPPaginatedGroupsResponse>;
}

/**
 * Represents the processed paginated response for user group sharing requests/invitations.
 */
interface ESPGroupSharingResponse {
  sharedRequests: ESPGroupSharingRequest[];
  hasNext: boolean;
  fetchNext?: () => Promise<ESPGroupSharingResponse>;
}

/**
 * Raw per-node error detail in a 207 command-response reply (snake_case).
 */
interface ESPCmdRespSendAPINodeResponseRaw {
  status: string;
  error_code?: string;
  description?: string;
}

/**
 * Represents the per-node error detail in a 207 command-response reply.
 */
interface ESPCmdRespSendAPINodeResponse {
  status: string;
  errorCode?: string;
  description?: string;
}

/**
 * Raw node-group entry in a 207 command-response reply (snake_case).
 */
interface ESPCmdRespSendAPIResponseEntryRaw {
  node_ids: string[];
  response: ESPCmdRespSendAPINodeResponseRaw;
}

/**
 * Represents one node-group entry in a 207 command-response reply.
 */
interface ESPCmdRespSendAPIResponseEntry {
  nodeIds: string[];
  response: ESPCmdRespSendAPINodeResponse;
}

/**
 * Raw backend response for POST `/user/nodes/cmd` (snake_case).
 */
interface ESPCmdRespSendAPIRawResponse {
  request_id: string;
  status?: string;
  responses?: ESPCmdRespSendAPIResponseEntryRaw[];
}

/**
 * Represents the response for adding a command-response request.
 * 200 OK: contains `status`. 207 Multi-Status: contains `responses`.
 */
interface ESPCmdRespSendAPIResponse {
  requestId: string;
  status?: string;
  responses?: ESPCmdRespSendAPIResponseEntry[];
}

/**
 * Represents one command-response request record returned by the backend.
 */
interface ESPCmdRespRequestAPIRecord {
  request_id: string;
  status: ESPCmdRespRequestStatus;
  node_id: string;
  device_status: ESPCmdRespDeviceStatus;
  status_description: string;
  request_data: Record<string, unknown> | string;
  request_timestamp: number;
  response_timestamp: number;
  expiration_timestamp: number;
  cmd: number;
  response_data?: Record<string, unknown> | string | null;
  /**
   * Present only when the stored request payload could not be deserialized.
   * When set, `request_data` should be treated as absent or null.
   * The overall response is still HTTP 200 — other items in `requests` are unaffected.
   */
  request_data_error?: ESPCmdRespDataError;
  /**
   * Present only when the stored response payload could not be deserialized.
   * When set, `response_data` should be treated as absent or null.
   * The overall response is still HTTP 200 — other items in `requests` are unaffected.
   */
  response_data_error?: ESPCmdRespDataError;
  is_base64?: boolean;
  user_name?: string;
  indefinite_timeout?: boolean;
}

/**
 * Represents the backend response for fetching command-response requests.
 */
interface ESPCmdRespListAPIResponse {
  requests: ESPCmdRespRequestAPIRecord[];
  next_id?: string;
}

/**
 * Represents the backend response for GET /user/file/upload_request.
 */
interface ESPFileUploadRequestAPIResponse {
  file_id: string;
  /** Presigned S3 PUT URL returned by the live API. */
  upload_url?: string;
  /** Legacy/alternate presigned upload URL field. */
  file_url?: string;
  status: string;
}

/**
 * Represents the backend response for POST /user/file/upload_confirm.
 */
interface ESPFileConfirmAPIResponse {
  file_id: string;
  file_url?: string;
  status: string;
}

/**
 * Represents one file record returned by GET /user/file.
 */
interface ESPFileAPIRecord {
  user_id?: string;
  user_name?: string;
  file_id: string;
  description?: string;
  metadata?: Record<string, unknown> | string;
  file_name?: string;
  entity_id?: string;
  entity_type?: string;
  file_type?: string;
  timestamp?: string;
  s3_key?: string;
  file_url?: string;
  file_md5?: string;
  public?: boolean;
}

/**
 * Represents the backend response for GET /user/file.
 */
interface ESPFileListAPIResponse {
  file_details?: ESPFileAPIRecord[];
  next_id?: string;
}

/**
 * Raw backend response for DELETE `/user/nodes/cmd` (snake_case).
 */
interface ESPCmdRespCancelAPIResponse {
  status: string;
  total_cancelled: string;
}

/**
 * Represents the processed response for cancelling command-response requests.
 */
interface ESPCmdRespCancelResponse {
  status: string;
  totalCancelled: string;
}

/**
 * Represents the processed paginated response for command-response requests.
 */
interface ESPCmdRespPaginatedResult {
  requests: ESPCmdRespRequestInterface[];
  hasNext: boolean;
  fetchNext?: () => Promise<ESPCmdRespPaginatedResult>;
}
/**
 * Represents the processed paginated response for uploaded files.
 */
interface ESPFilePaginatedResult {
  files: ESPFile[];
  hasNext: boolean;
  fetchNext?: () => Promise<ESPFilePaginatedResult>;
}

export {
  ESPAPIResponse,
  ESPAPIError,
  LoginWithPasswordResponse,
  RequestLoginOTPResponse,
  LoginWithOTPResponse,
  GetUserInfoResponse,
  ESPRMUserInfo,
  ExtendSessionResponse,
  LoginWithOauthCodeResponse,
  CreateGroupAPIResponse,
  GetGroupsAPIResponse,
  GetGroupsResponse,
  GetNodesAPIResponse,
  ESPPaginatedNodesResponse,
  GetNodeDeatailsAPIResponse,
  GetNodeSharingRequestsAPIResponse,
  ESPNodeSharingResponse,
  ESPPaginatedGroupsResponse,
  CreateSubGroupAPIResponse,
  ESPGroupSharingResponse,
  GetGroupSharingRequestsAPIResponse,
  AssumeRoleResponse,
  ESPCmdRespSendAPINodeResponse,
  ESPCmdRespSendAPINodeResponseRaw,
  ESPCmdRespSendAPIResponseEntry,
  ESPCmdRespSendAPIResponseEntryRaw,
  ESPCmdRespSendAPIRawResponse,
  ESPCmdRespSendAPIResponse,
  ESPCmdRespRequestAPIRecord,
  ESPCmdRespListAPIResponse,
  ESPCmdRespCancelAPIResponse,
  ESPCmdRespCancelResponse,
  ESPCmdRespPaginatedResult,
  ESPFileUploadRequestAPIResponse,
  ESPFileConfirmAPIResponse,
  ESPFileAPIRecord,
  ESPFileListAPIResponse,
  ESPFilePaginatedResult,
};
