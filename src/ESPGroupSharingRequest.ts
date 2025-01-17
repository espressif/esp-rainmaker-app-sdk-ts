/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ESPGroupSharingRequestInterface,
  ESPGroupSharingStatus,
} from "./types/ESPModules";

/**
 * Represents a group sharing request in the system.
 *
 * This class encapsulates the details of a request made by a user for sharing a group. It includes the status
 * of the request, relevant group information, and user details related to the request.
 */
export class ESPGroupSharingRequest implements ESPGroupSharingRequestInterface {
  /**
   * The unique identifier for the group sharing request.
   */
  id: string;

  /**
   * The current status of the group sharing request (e.g., pending, accepted, rejected).
   */
  status: ESPGroupSharingStatus;

  /**
   * The timestamp indicating when the group sharing request was created.
   */
  timestamp: number;

  /**
   * A list of group IDs associated with the sharing request.
   */
  groupIds: string[];

  /**
   * A list of group names associated with the sharing request.
   */
  groupnames: string[];

  /**
   * The username of the user who created the group sharing request.
   */
  username: string;

  /**
   * The primary username associated with the group sharing request.
   */
  primaryUsername: string;

  /**
   * A flag indicating whether the group sharing request involves a transfer.
   */
  transfer: boolean;

  /**
   * The new role to be assigned to the user in the group as part of the sharing request.
   */
  newRole: string;

  /**
   * Additional metadata associated with the group sharing request.
   */
  metadata: Record<string, any>;

  /**
   * Creates an instance of `ESPGroupSharingRequest` with the specified configuration.
   *
   * @param config - The configuration object containing the properties to initialize the group sharing request.
   */
  constructor(config: ESPGroupSharingRequestInterface) {
    this.id = config.id;
    this.status = config.status;
    this.timestamp = config.timestamp;
    this.groupIds = config.groupIds;
    this.groupnames = config.groupnames;
    this.username = config.username;
    this.primaryUsername = config.primaryUsername;
    this.transfer = config.transfer;
    this.newRole = config.newRole;
    this.metadata = config.metadata;
  }
}
