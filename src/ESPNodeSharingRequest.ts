/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPNodeSharingRequestInterface } from "./types/ESPModules";

/**
 * Represents a user node in the system, managing its configuration and connectivity status.
 * Implements the `ESPRMNodeInterface`.
 */
export class ESPNodeSharingRequest implements ESPNodeSharingRequestInterface {
  /**
   * Unique identifier for the sharing request.
   */
  id: string;

  /**
   * Current status of the sharing request.
   */
  status: string;

  /**
   * Timestamp of when the request was created.
   */
  timestamp: number;

  /**
   * List of node IDs involved in the sharing request.
   */
  nodeIDs: string[];

  /**
   * Username of the user involved in the sharing request.
   */
  username: string;

  /**
   * The primary username associated with the node sharing request.
   */
  primaryUsername: string;

  /**
   * Indicates if the request is for transferring ownership.
   */
  transfer: boolean;

  /**
   * New role assigned to the user.
   */
  newRole: string;

  /**
   * Additional metadata for the sharing request.
   */
  metadata: Record<string, any>;

  /**
   * Creates an instance of `ESPRMNode`.
   *
   * @param data - An object containing the node details.
   */
  constructor(data: ESPNodeSharingRequestInterface) {
    this.id = data.id;
    this.status = data.status;
    this.timestamp = data.timestamp;
    this.nodeIDs = data.nodeIDs;
    this.username = data.username;
    this.primaryUsername = data.primaryUsername;
    this.transfer = data.transfer;
    this.newRole = data.newRole;
    this.metadata = data.metadata;
  }
}
