/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMConnectivityStatus } from "./ESPRMConnectivityStatus";
import { ESPRMNodeConfig } from "./ESPRMNodeConfig";
import { ESPRMNodeInterface, ESPTransportType } from "./types/node";
import {
  ESPTransportConfig,
  ESPTransportInterface,
  ESPTransportMode,
} from "./types/transport";
import { ESPNodeSubscriptionConfig } from "./types/subscription";

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
  transportOrder: (ESPTransportMode | string)[] = [];

  /** Available Transports with the node.*/
  availableTransports: Record<ESPTransportMode | string, ESPTransportConfig> =
    {};

  /**
   * Custom transport managers associated with the node.
   *
   * Custom transport managers allow you to implement your own communication protocols
   * (e.g., Bluetooth, WebSocket, custom protocols) alongside the built-in `local` and `cloud` transports.
   * Each custom transport must implement the `ESPTransportInterface` and receives a reference to the
   * node instance, providing full flexibility to access node metadata, configuration, devices, and
   * connectivity status.
   *
   * The SDK uses transports in the priority order specified in `transportOrder`:
   * 1. If a transport mode exists in `customTransportManagers`, it uses the custom transport
   * 2. If not, it falls back to the built-in transport (local/cloud)
   * 3. If the transport fails, it moves to the next transport in the order
   * 4. If all transports fail, an error is thrown
   *
   * @example
   * ```typescript
   * const myCustomTransport = new MyCustomTransport();
   * const node = new ESPRMNode({
   *   id: "my-node-id",
   *   transportOrder: ["bluetooth", "local", "cloud"],
   *   availableTransports: {
   *     bluetooth: { type: "bluetooth", metadata: {} },
   *     local: { type: "local", metadata: { baseUrl: "http://192.168.1.100" } },
   *     cloud: { type: "cloud", metadata: {} }
   *   },
   *   customTransportManagers: {
   *     bluetooth: myCustomTransport
   *   }
   * });
   * ```
   *
   * Common use cases include:
   * - Bluetooth Transport: Direct device communication via Bluetooth
   * - WebSocket Transport: Real-time bidirectional communication
   * - Custom Protocol: Implement proprietary protocols
   */
  customTransportManagers?: Record<ESPTransportType, ESPTransportInterface>;

  /**
   * Subscription configuration for this node.
   * Allows customization of subscription channel priority order.
   *
   * If not set, the node will use the global channel order from ESPSubscriptionManager.
   * Setting this allows per-node optimization of subscription channels.
   *
   * @example
   * ```typescript
   * // Set custom channel order for this node
   * node.subscriptionConfig = {
   *   channelOrder: ["notification"]
   * };
   * ```
   */
  subscriptionConfig?: ESPNodeSubscriptionConfig;

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
    this.customTransportManagers = data.customTransportManagers;
    this.subscriptionConfig = data.subscriptionConfig;
  }
}
