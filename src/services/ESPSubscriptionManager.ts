/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMNode } from "../ESPRMNode";
import {
  ESPNodeUpdateData,
  ESPSubscriptionChannelInterface,
} from "../types/subscription";

/**
 * Manages subscription channels and coordinates node update subscriptions.
 * This is the central hub for all parameter update subscriptions from various sources
 * (notifications, Matter, MQTT, BLE, custom channels, etc.)
 *
 * The manager uses a priority-based approach:
 * 1. For each node, it determines the effective channel order (node-specific or global)
 * 2. It filters channels based on availability and node support
 * 3. It tries channels in order until one succeeds
 *
 * @example
 * ```typescript
 * // Register channels
 * await ESPRMBase.subscriptionManager.registerChannel(new NotificationSubscriptionChannel());
 * await ESPRMBase.subscriptionManager.registerChannel(new MatterSubscriptionChannel());
 *
 * // Set global channel order
 * ESPRMBase.subscriptionManager.setGlobalChannelOrder(["matter", "notification"]);
 *
 * // Subscribe to node updates
 * const nodes = await user.getNodes();
 * await ESPRMBase.subscriptionManager.subscribeToAllNodes(nodes, (update) => {
 *   console.log(`Node ${update.nodeId} updated via ${update.source}`);
 * });
 * ```
 */
export class ESPSubscriptionManager {
  /**
   * Registered subscription channels (channelId -> channel instance)
   */
  private channels: Map<string, ESPSubscriptionChannelInterface> = new Map();

  /**
   * Global default channel order (used when node doesn't have custom order)
   * Channels are tried in this order until one succeeds
   */
  private globalChannelOrder: string[] = [];

  /**
   * Whether the manager has been initialized
   */
  private initialized: boolean = false;

  /**
   * Initialize the subscription manager.
   * This initializes all registered channels.
   * Should be called during SDK initialization.
   *
   * @returns Promise that resolves when initialization is complete
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    for (const channel of this.channels.values()) {
      try {
        await channel.initialize();
      } catch (error) {
        console.error(
          `Failed to initialize channel ${channel.channelId}:`,
          error
        );
      }
    }

    this.initialized = true;
  }

  /**
   * Register a new subscription channel.
   *
   * @param channel - The channel to register
   * @param autoInitialize - Whether to initialize the channel immediately (default: true)
   * @throws Error if a channel with the same ID is already registered
   *
   * @example
   * ```typescript
   * const matterChannel = new MatterSubscriptionChannel();
   * await ESPRMBase.subscriptionManager.registerChannel(matterChannel);
   * ```
   */
  async registerChannel(
    channel: ESPSubscriptionChannelInterface,
    autoInitialize: boolean = true
  ): Promise<void> {
    if (this.channels.has(channel.channelId)) {
      throw new Error(`Channel ${channel.channelId} is already registered`);
    }

    this.channels.set(channel.channelId, channel);

    if (autoInitialize && this.initialized) {
      await channel.initialize();
    }
  }

  /**
   * Unregister a subscription channel.
   * This will dispose the channel and remove it from the manager.
   *
   * @param channelId - ID of the channel to unregister
   *
   * @example
   * ```typescript
   * await ESPRMBase.subscriptionManager.unregisterChannel("mqtt");
   * ```
   */
  async unregisterChannel(channelId: string): Promise<void> {
    const channel = this.channels.get(channelId);
    if (!channel) return;

    await channel.dispose();
    this.channels.delete(channelId);
  }

  /**
   * Set the global default channel order.
   * This order is used for all nodes unless they have a custom order in subscriptionConfig.
   *
   * @param channelIds - Array of channel IDs in priority order (first = highest priority)
   *
   * @example
   * ```typescript
   * // Try Matter first, then notifications, then MQTT
   * ESPRMBase.subscriptionManager.setGlobalChannelOrder([
   *   "matter",
   *   "notification",
   *   "mqtt"
   * ]);
   * ```
   */
  setGlobalChannelOrder(channelIds: string[]): void {
    const invalidChannels = channelIds.filter((id) => !this.channels.has(id));
    if (invalidChannels.length > 0) {
      console.warn(`Unknown channels in order: ${invalidChannels.join(", ")}`);
    }

    this.globalChannelOrder = channelIds;
  }

  /**
   * Get the effective channel order for a node.
   * Priority: node.subscriptionConfig.channelOrder > global channel order
   *
   * @param node - The node to get channel order for
   * @returns Array of channel IDs in priority order
   */
  getEffectiveChannelOrder(node: ESPRMNode): string[] {
    if (node.subscriptionConfig?.channelOrder) {
      return node.subscriptionConfig.channelOrder;
    }

    return this.globalChannelOrder;
  }

  /**
   * Get available channels for a node.
   * Filters channels based on:
   * - Channel is registered
   * - Channel supports the node (via supportsNode())
   * - Channel is in the effective order
   *
   * @param node - The node to get channels for
   * @returns Array of available channels in priority order
   *
   * @example
   * ```typescript
   * const channels = ESPRMBase.subscriptionManager.getAvailableChannelsForNode(node);
   * console.log(`Available channels: ${channels.map(c => c.channelId).join(", ")}`);
   * ```
   */
  getAvailableChannelsForNode(
    node: ESPRMNode
  ): ESPSubscriptionChannelInterface[] {
    const effectiveOrder = this.getEffectiveChannelOrder(node);

    return effectiveOrder
      .map((channelId) => this.channels.get(channelId))
      .filter(
        (channel) => channel && channel.supportsNode(node)
      ) as ESPSubscriptionChannelInterface[];
  }

  /**
   * Subscribe to updates for a specific node using priority-based channel selection.
   * Tries channels in order until one succeeds.
   *
   * @param node - The node to subscribe to
   * @param callback - Function to call when updates are received
   * @throws Error if no channels are available or all channels fail
   *
   * @example
   * ```typescript
   * await ESPRMBase.subscriptionManager.subscribeToNode(node, (update) => {
   *   console.log(`Update from ${update.source}:`, update.payload);
   * });
   * ```
   */
  async subscribeToNode(
    node: ESPRMNode,
    callback: (update: ESPNodeUpdateData) => void
  ): Promise<void> {
    const availableChannels = this.getAvailableChannelsForNode(node);

    if (availableChannels.length === 0) {
      throw new Error(`No available subscription channels for node ${node.id}`);
    }

    let lastError: Error | undefined;

    for (const channel of availableChannels) {
      try {
        await channel.subscribe(callback, node.id);
        return;
      } catch (error) {
        lastError = error as Error;
      }
    }

    throw new Error(
      `All subscription channels failed for node ${node.id}. Last error: ${lastError?.message}`
    );
  }

  /**
   * Subscribe to updates for all nodes.
   * This is used by the global ESPRMEventType.nodeUpdates subscription.
   *
   * @param nodes - Array of nodes to subscribe to
   * @param callback - Function to call when any node is updated
   *
   * @example
   * ```typescript
   * const nodes = await user.getNodes();
   * await ESPRMBase.subscriptionManager.subscribeToAllNodes(nodes, (update) => {
   *   console.log(`Node ${update.nodeId} updated`);
   * });
   * ```
   */
  async subscribeToAllNodes(
    nodes: ESPRMNode[],
    callback: (update: ESPNodeUpdateData) => void
  ): Promise<void> {
    const errors: Array<{ nodeId: string; error: Error }> = [];

    for (const node of nodes) {
      try {
        await this.subscribeToNode(node, callback);
      } catch (error) {
        errors.push({ nodeId: node.id, error: error as Error });
      }
    }

    if (errors.length > 0) {
      console.warn(`Failed to subscribe to ${errors.length} nodes:`, errors);
    }
  }

  /**
   * Unsubscribe from updates for a specific node.
   * This will unsubscribe from all channels for the node.
   *
   * @param nodeId - ID of the node to unsubscribe from
   *
   * @example
   * ```typescript
   * await ESPRMBase.subscriptionManager.unsubscribeFromNode("node-123");
   * ```
   */
  async unsubscribeFromNode(nodeId: string): Promise<void> {
    for (const channel of this.channels.values()) {
      try {
        await channel.unsubscribe(nodeId);
      } catch (error) {
        console.warn(
          `Failed to unsubscribe from ${channel.channelId} for node ${nodeId}:`,
          error
        );
      }
    }
  }

  /**
   * Get all registered channel IDs.
   *
   * @returns Array of channel IDs
   *
   * @example
   * ```typescript
   * const channels = ESPRMBase.subscriptionManager.getRegisteredChannels();
   * console.log(`Registered channels: ${channels.join(", ")}`);
   * ```
   */
  getRegisteredChannels(): string[] {
    return Array.from(this.channels.keys());
  }

  /**
   * Get the global channel order.
   *
   * @returns Array of channel IDs in priority order
   */
  getGlobalChannelOrder(): string[] {
    return [...this.globalChannelOrder];
  }

  /**
   * Cleanup all subscriptions and dispose channels.
   * Should be called when app is closing or SDK is being torn down.
   *
   * @example
   * ```typescript
   * await ESPRMBase.subscriptionManager.dispose();
   * ```
   */
  async dispose(): Promise<void> {
    for (const channel of this.channels.values()) {
      await channel.dispose();
    }

    this.channels.clear();
    this.initialized = false;
  }
}
