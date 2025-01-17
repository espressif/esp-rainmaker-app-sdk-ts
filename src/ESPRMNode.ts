/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMConnectivityStatus } from "./ESPRMConnectivityStatus";
import { ESPRMNodeConfig } from "./ESPRMNodeConfig";
import { ESPRMNodeInterface } from "./types/node";
import { ESPTransportConfig, ESPTransportMode } from "./types/transport";

/**
 * Represents a user node in the system, managing its configuration and connectivity status.
 * Implements the `ESPRMNodeInterface`.
 */
export class ESPRMNode implements ESPRMNodeInterface {
  /** The unique identifier of the node. */
  id: string;

  /** The type of the node. */
  type?: string;

  /** Indicates if the node is associated with a primary user. */
  isPrimaryUser?: boolean;

  /** The connectivity status of the node. */
  connectivityStatus?: ESPRMConnectivityStatus;

  /** The configuration settings for the node. */
  nodeConfig?: ESPRMNodeConfig;

  /** Tags associated with the node. */
  tags?: string[];

  /** Metadata associated with the node. */
  metadata?: Record<string, any>;

  /** Role of user associated with the node. */
  role?: string;

  /** Transport order associated with the node.*/
  transportOrder: ESPTransportMode[] | [];

  /** Available Transports with the node.*/
  availableTransports:
    | Partial<Record<ESPTransportMode, ESPTransportConfig>>
    | {};

  /**
   * Creates an instance of `ESPRMNode`.
   *
   * @param data - An object containing the node details.
   */
  constructor(data: ESPRMNodeInterface) {
    this.id = data.id;
    this.type = data.type;
    this.isPrimaryUser = data.isPrimaryUser;
    this.connectivityStatus = data.connectivityStatus
      ? new ESPRMConnectivityStatus(data.connectivityStatus)
      : undefined;
    this.nodeConfig = data.nodeConfig
      ? new ESPRMNodeConfig(data.nodeConfig, this)
      : undefined;
    this.tags = data.tags;
    this.role = data.role;
    this.metadata = data.metadata;
    this.transportOrder = data.transportOrder;
    this.availableTransports = data.availableTransports;
  }
}
