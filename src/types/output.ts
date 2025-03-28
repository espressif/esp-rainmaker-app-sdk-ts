/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPGroupSharingRequest } from "../ESPGroupSharingRequest";
import { ESPNodeSharingRequest } from "../ESPNodeSharingRequest";
import { ESPRMGroup } from "../ESPRMGroup";
import { ESPRMNode } from "../ESPRMNode";

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
interface LoginWithOTPResponse extends LoginWithPasswordResponse {}

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
  extends Omit<LoginWithPasswordResponse, "refreshtoken"> {}

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
interface CreateSubGroupAPIResponse extends CreateGroupAPIResponse {}

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
};
