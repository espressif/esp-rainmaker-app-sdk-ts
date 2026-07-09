/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Represents the node sharing request.
 */
interface ESPNodeSharingRequestInterface {
  id: string;
  status: string;
  timestamp: number;
  nodeIDs: string[];
  username: string;
  primaryUsername: string;
  transfer: boolean;
  newRole: string;
  metadata: Record<string, any>;
}

/**
 * Represents the group sharing request.
 */

interface ESPGroupSharingRequestInterface {
  id: string;
  status: ESPGroupSharingStatus;
  timestamp: number;
  groupIds: string[];
  groupnames: string[];
  username: string;
  primaryUsername: string;
  transfer: boolean;
  newRole: string;
  metadata: Record<string, any>;
}

/**
 * Represents the group sharing request status.
 */
enum ESPGroupSharingStatus {
  accepted = "accepted",
  pending = "pending",
  rejected = "rejected",
}

/**
 * Represents the platform endpoint.
 */
interface ESPPlatformEndpointInterface {
  deviceToken: string;
  endpoint: string;
  applicationARN: string;
  platform?: string;
}

/**
 * Decode error codes returned when the backend cannot deserialize a stored payload.
 */
enum ESPCmdRespDataError {
  ErrorDeserializeJson = "ERROR_DESERIALIZE_JSON",
}

/**
 * Numeric status code returned by the device for a command-response request.
 */
enum ESPCmdRespDeviceStatus {
  Success = 0,
  Failed = 1,
  InvalidCommand = 2,
  AuthenticationFailed = 3,
  StatusNotFound = 4,
}

/**
 * Status of a command-response request.
 */
type ESPCmdRespRequestStatus =
  | "requested"
  | "in_progress"
  | "success"
  | "failure"
  | "timed_out"
  | "overridden"
  | "cancelled";

/**
 * Represents a command-response request in the SDK.
 */
interface ESPCmdRespRequestInterface {
  requestId: string;
  status: ESPCmdRespRequestStatus;
  nodeId: string;
  deviceStatus: ESPCmdRespDeviceStatus;
  statusDescription: string;
  requestData: Record<string, unknown> | string;
  requestTimestamp: number;
  responseTimestamp: number;
  expirationTimestamp: number;
  cmdId: number;
  responseData?: Record<string, unknown> | string | null;
  requestDataError?: ESPCmdRespDataError;
  responseDataError?: ESPCmdRespDataError;
  isBase64?: boolean;
  userName?: string;
  indefiniteTimeout?: boolean;
}

/**
 * Paginated list of command-response requests.
 */
interface ESPCmdRespPaginatedResultInterface {
  requests: ESPCmdRespRequestInterface[];
  hasNext: boolean;
  fetchNext?: () => Promise<ESPCmdRespPaginatedResultInterface>;
}

export {
  ESPNodeSharingRequestInterface,
  ESPGroupSharingRequestInterface,
  ESPGroupSharingStatus,
  ESPPlatformEndpointInterface,
  ESPCmdRespDataError,
  ESPCmdRespDeviceStatus,
  ESPCmdRespRequestStatus,
  ESPCmdRespRequestInterface,
  ESPCmdRespPaginatedResultInterface,
};
