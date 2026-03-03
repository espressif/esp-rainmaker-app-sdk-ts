/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMNode } from "../ESPRMNode";

/**
 * Enum for ESP Rainmaker Event Types.
 * This enum defines the types of events that can be used in event subscriptions.
 */
enum ESPRMEventType {
  localDiscovery = "com.espressif.event.localDiscovery",
  nodeUpdates = "com.espressif.event.nodeUpdates",
}

/**
 * Standardized format for node parameter updates from any subscription channel.
 * All subscription channels must transform their data into this format.
 */
interface ESPNodeUpdateData {
  /**
   * ID of the node that was updated
   */
  nodeId: string;

  /**
   * Source channel that provided this update (e.g., "notification", "matter", "mqtt")
   */
  source: string;

  /**
   * Type of event (e.g., "rmaker.event.node_params_changed")
   */
  eventType: string;

  /**
   * The actual parameter data
   * Format: { deviceName: { paramName: value } }
   */
  payload: Record<string, any>;

  /**
   * Optional metadata specific to the channel
   * Examples:
   * - Notification: { platform: "ios", notificationId: "123" }
   * - Matter: { endpointId: 1, clusterId: 6 }
   * - MQTT: { topic: "node/123/params", qos: 1 }
   */
  metadata?: Record<string, any>;
}

/**
 * Interface for subscription channels that provide device parameter updates.
 * Each channel represents a different communication method (notifications, Matter, MQTT, BLE, etc.)
 *
 * Implementation Guidelines:
 * - channelId should be unique and descriptive (e.g., "notification", "matter", "mqtt")
 * - supportsNode() should check if the node has the required capabilities/configuration
 * - subscribe() should set up the subscription and call the callback when updates arrive
 * - All updates must be transformed into ESPNodeUpdateData format
 */
interface ESPSubscriptionChannelInterface {
  /**
   * Unique identifier for this channel (e.g., "notification", "matter", "mqtt")
   */
  readonly channelId: string;

  /**
   * Initialize the channel (setup connections, adapters, etc.)
   * Called once when channel is registered with the subscription manager
   *
   * @throws Error if initialization fails
   */
  initialize(): Promise<void>;

  /**
   * Check if this channel supports a specific node.
   * This method determines whether the channel can provide updates for the given node.
   *
   * Examples:
   * - Notification channel: returns true for all nodes (generic)
   * - Matter channel: returns true only if node has Matter capability in nodeConfig
   * - BLE channel: returns true only if node has BLE support in metadata
   *
   * @param node - The node to check support for
   * @returns true if this channel can provide updates for the node
   */
  supportsNode(node: ESPRMNode): boolean;

  /**
   * Subscribe to parameter updates for a specific node or all nodes.
   *
   * @param callback - Function to call when updates are received
   * @param nodeId - Optional node ID. If provided, only updates for this node trigger the callback
   * @returns Promise that resolves when subscription is active
   * @throws Error if subscription fails (e.g., adapter not configured, connection failed)
   */
  subscribe(
    callback: (update: ESPNodeUpdateData) => void,
    nodeId?: string
  ): Promise<void>;

  /**
   * Unsubscribe from updates for a specific node or all nodes.
   *
   * @param nodeId - Optional node ID. If not provided, unsubscribes from all nodes
   * @returns Promise that resolves when unsubscription is complete
   */
  unsubscribe(nodeId?: string): Promise<void>;

  /**
   * Cleanup and dispose of resources.
   * Called when channel is unregistered or app is closing.
   *
   * This should:
   * - Close connections
   * - Clear callbacks
   * - Release resources
   * - Perform any channel-specific cleanup (e.g., delete notification endpoint)
   *
   * @returns Promise that resolves when disposal is complete
   */
  dispose(): Promise<void>;
}

/**
 * Subscription configuration for a specific node.
 * Allows per-node customization of subscription channel priority.
 */
interface ESPNodeSubscriptionConfig {
  /**
   * Custom channel order for this node (overrides global order).
   * Channels are tried in the order specified until one succeeds.
   * If not set, uses the global channel order from ESPSubscriptionManager.
   *
   * Example: ["matter", "notification", "mqtt"]
   * - Try Matter first (if supported)
   * - Fall back to notifications
   * - Finally try MQTT
   */
  channelOrder?: string[];
}

export {
  ESPRMEventType,
  ESPNodeUpdateData,
  ESPSubscriptionChannelInterface,
  ESPNodeSubscriptionConfig,
};
