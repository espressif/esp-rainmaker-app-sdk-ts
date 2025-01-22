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

export {
  ESPNodeSharingRequestInterface,
  ESPGroupSharingRequestInterface,
  ESPGroupSharingStatus,
  ESPPlatformEndpointInterface,
};
