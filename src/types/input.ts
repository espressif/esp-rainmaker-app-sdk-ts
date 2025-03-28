/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPLocalControlAdapterInterface } from "../services/ESPTransport/ESPLocalControlAdapterInterface";
import { ESPLocalDiscoveryAdapterInterface } from "../services/ESPTransport/ESPLocalDiscoveryAdapterInterface";
import { ESPNotificationAdapterInterface } from "./adapter";
import { ESPRMNodeInterface } from "./node";
import { ESPProvisionAdapterInterface } from "./provision";
import { ESPRMStorageAdapterInterface } from "./storage";
import { ESPRMEventType } from "./subscription";

/**
 * Configuration options for ESPRMBase SDK.
 */
interface ESPRMBaseConfig {
  baseUrl: string;
  authUrl?: string;
  redirectUrl?: string;
  clientId?: string;
  version?: string;
  provisionAdapter?: ESPProvisionAdapterInterface;
  customStorageAdapter?: ESPRMStorageAdapterInterface;
  localDiscoveryAdapter?: ESPLocalDiscoveryAdapterInterface;
  localControlAdapter?: ESPLocalControlAdapterInterface;
  notificationAdapter?: ESPNotificationAdapterInterface;
}

/**
 * Configuration options for ESPRMAPIManager.
 */
interface ESPRMAPIManagerConfig {
  baseUrl: string;
  version: string;
}

/**
 * Request payload for user sign-up.
 */
interface SignUpRequest {
  user_name: string;
  password: string;
}

/**
 * Request payload for confirming a user's registration.
 */
interface ConfirmUserRequest {
  user_name: string;
  verification_code: string;
  tags?: string[];
}

/**
 * Request payload for logging in with a password.
 */
interface LoginWithPasswordRequest extends SignUpRequest {}

/**
 * Request payload for logging in with an OTP.
 */
interface LoginWithOTPRequest extends ConfirmUserRequest {
  session: string;
}

/**
 * Request payload for setting a new password.
 */
interface SetNewPasswordRequest extends SignUpRequest {
  verification_code: string;
}

/**
 * Data structure for user tokens.
 */
interface UserTokensData {
  idToken: string;
  accessToken: string;
  refreshToken: string;
}

/**
 * Request payload for changing a user's password.
 */
interface ChangePasswordRequest {
  password: string;
  newpassword: string;
}

/**
 * Request payload for logging out.
 */
interface LogoutRequest {
  logout_all?: boolean;
}

/**
 * Request payload for retrieving user information.
 */
interface GetUserInfoRequest {
  custom_data?: boolean;
}

/**
 * Type alias for the names of user tokens.
 */
type tokenName = keyof UserTokensData;

/**
 * Interface representing a group of nodes.
 */
interface ESPRMGroupInterface {
  name: string;
  id: string;
  isPrimaryUser?: boolean;
  totalNodes?: number;
  parentGroupId?: string;
  type?: string;
  mutuallyExclusive?: boolean;
  nodes?: string[];
  nodeDetails?: ESPRMNodeInterface[];
  subGroups?: ESPRMGroupInterface[];
  description?: string;
  metadata?: Record<string, any>;
  customData?: Record<string, any>;
  isMatter?: boolean;
  fabricId?: string;
}

/**
 * Interface representing a group sharing user information.
 */
interface ESPGroupSharingUserInfoInterface {
  username: string;
  metadata?: Record<string, any>;
}

/**
 * Interface representing a group sharing information.
 */
interface ESPGroupSharingInfoInterface {
  groupId: string;
  mutuallyExclusive: boolean;
  primaryUsers?: ESPGroupSharingUserInfoInterface[];
  secondaryUsers?: ESPGroupSharingUserInfoInterface[];
  subGroupsInfo?: ESPGroupSharingInfoInterface[];
  parentGroupsInfo?: ESPGroupSharingInfoInterface[];
}

/**
 * Request payload for creating a new group.
 */
interface CreateGroupRequest {
  name: string;
  nodeIds?: string[];
  description?: string;
  customData?: Record<string, any>;
  type?: string;
  mutuallyExclusive?: boolean;
}

/**
 * Request payload for creating a new sub-group.
 */
interface CreateSubGroupRequest extends CreateGroupRequest {}

/**
 * Parameters for retrieving user nodes.
 */
interface GetUserNodesRequestParams {
  nodeDetails?: boolean;
  nodeConfig?: boolean;
  parameters?: boolean;
  connectivityStatus?: boolean;
  tags?: string;
  showTags?: boolean;
  resultCount?: number;
}

/**
 * Request payload for updating group information.
 */
interface UpdateGroupInfoRequest {
  groupName?: string;
  type?: string;
  mutuallyExclusive?: boolean;
  description?: string;
  groupMetaData?: Record<string, any>;
  customData?: Record<string, any>;
}

/**
 * Request payload for sharing a group with another user.
 */
interface ShareGroupsRequest {
  groupIds: string[];
  toUserName: string;
  makePrimary?: boolean;
  metadata?: Record<string, any>;
}

/**
 * Request payload for transferring group ownership to another user.
 */
interface TransferGroupsRequest
  extends Omit<ShareGroupsRequest, "makePrimary"> {
  assignRoleToSelf?: string;
}

/**
 * Request payload for creating share request of node with another user.
 */
interface ShareWithRequest {
  username: string;
  makePrimary?: boolean;
  metadata?: Record<string, any>;
}

/**
 * Request payload for creating transfer request of node with another user.
 */
interface TransferNodeRequest {
  toUserName: string;
  selfToSecondary?: boolean;
}

/**
 * Request payload for fetching node sharing requests/invitations of current user.
 */
interface FetchNodeSharingRequestsParam {
  primaryUser: boolean;
  recordsNumber?: number;
  nextRequestId?: string;
  nextUserName?: string;
}

/**
 * Request payload for fetching group sharing requests/invitations of current user.
 */
interface FetchGroupSharingRequestsParam {
  primaryUser: boolean;
  recordsNumber?: number;
  nextRequestId?: string;
  nextUserName?: string;
}

/**
 * Represents subscription model event callbacks mapper
 */
type EventCallbacks = {
  [event in ESPRMEventType]?: Function[];
};

/**
 * Request payload for fetching groups of current user.
 */
interface GetGroupsRequestParams {
  withNodeList?: boolean;
  withSubGroups?: boolean;
  resultCount?: number;
}

/**
 * Request payload for fetching group of current user by id.
 */
interface GetGroupByIdRequestParams
  extends Omit<GetGroupsRequestParams, "resultCount"> {
  id: string;
  withNodeDetails?: boolean;
}

/**
 * Request payload for fetching group of current user by name.
 */
interface GetGroupByNameRequestParams
  extends Omit<GetGroupsRequestParams, "resultCount"> {
  name: string;
  withNodeDetails?: boolean;
}

/**
 * Request payload for sharing group with other user.
 */
interface ShareGroupRequest extends Omit<ShareGroupsRequest, "groupIds"> {}

/**
 * Request payload for transfering group with other user.
 */
interface TransferGroupRequest
  extends Omit<TransferGroupsRequest, "groupIds"> {}

/**
 * Request payload for fetching sharing info of current group.
 */
interface GetSharingInfoRequest {
  metadata?: boolean;
  withSubGroups?: boolean;
  withParentGroups?: boolean;
}

/**
 * Request payload for creating platform endpoint.
 */
interface CreatePlatformEndpointRequest {
  platform: string;
  deviceToken: string;
  type?: string;
}

/**
 * Represents the parameters for a device.
 */
interface DeviceParams {
  [paramName: string]: any;
}

/**
 * Represents the payload containing parameters for a node.
 */
interface NodePayload {
  [deviceName: string]: DeviceParams[];
}

/**
 * Represents the payload containing parameters for multiple nodes.
 */
interface MultipleNodePayload {
  nodeId: string;
  payload: NodePayload;
}

/**
 * Enum for property check mode of hasProperty helper method.
 */
enum PropertyCheckMode {
  OwnPropertyOnly,
  PrototypeChain,
}

/**
 * Represents the permission type for custom data.
 */
interface PermissionType {
  read?: string[];
  write?: string[];
}

/**
 * Represents the data entry for custom data.
 */
interface DataEntry<T = unknown> {
  value?: T;
  perms?: PermissionType[] | null;
}

/**
 * Represents the request payload for user custom data.
 */
type UserCustomDataRequest = Record<string, DataEntry | null>;

/**
 * Represents the response payload for user custom data.
 */
type UserCustomDataResponse = Record<string, DataEntry>;

export {
  ESPRMBaseConfig,
  ESPRMAPIManagerConfig,
  SignUpRequest,
  ConfirmUserRequest,
  LoginWithPasswordRequest,
  LoginWithOTPRequest,
  SetNewPasswordRequest,
  UserTokensData,
  ChangePasswordRequest,
  LogoutRequest,
  GetUserInfoRequest,
  tokenName,
  CreateGroupRequest,
  ESPRMGroupInterface,
  GetUserNodesRequestParams,
  UpdateGroupInfoRequest,
  ShareGroupsRequest,
  TransferGroupsRequest,
  ShareWithRequest,
  TransferNodeRequest,
  FetchNodeSharingRequestsParam,
  EventCallbacks,
  GetGroupsRequestParams,
  GetGroupByIdRequestParams,
  CreateSubGroupRequest,
  GetGroupByNameRequestParams,
  ShareGroupRequest,
  TransferGroupRequest,
  ESPGroupSharingUserInfoInterface,
  ESPGroupSharingInfoInterface,
  GetSharingInfoRequest,
  FetchGroupSharingRequestsParam,
  CreatePlatformEndpointRequest,
  DeviceParams,
  NodePayload,
  MultipleNodePayload,
  PropertyCheckMode,
  PermissionType,
  DataEntry,
  UserCustomDataRequest,
  UserCustomDataResponse,
};
