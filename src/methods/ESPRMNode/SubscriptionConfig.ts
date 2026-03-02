/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMNode } from "../../ESPRMNode";
import { ESPRMBase } from "../../ESPRMBase";

/**
 * Augments the ESPRMNode class with methods for managing subscription configuration.
 */
declare module "../../ESPRMNode" {
  interface ESPRMNode {
    /**
     * Set the subscription channel order for this node.
     * This overrides the global channel order from ESPSubscriptionManager.
     *
     * Channels are tried in the order specified until one succeeds.
     * Only channels that support the node (via supportsNode()) will be used.
     *
     * @param channelIds - Array of channel IDs in priority order
     *
     * @example
     * ```typescript
     * // Prioritize Matter for this node
     * node.setSubscriptionChannelOrder(["matter", "notification", "mqtt"]);
     * ```
     */
    setSubscriptionChannelOrder(channelIds: string[]): void;

    /**
     * Get the effective subscription channel order for this node.
     * Returns the node-specific order if set, otherwise returns the global order.
     *
     * @returns Array of channel IDs in priority order
     *
     * @example
     * ```typescript
     * const order = node.getSubscriptionChannelOrder();
     * console.log(`Channel order: ${order.join(", ")}`);
     * ```
     */
    getSubscriptionChannelOrder(): string[];

    /**
     * Clear the node-specific subscription channel order.
     * After calling this, the node will use the global channel order.
     *
     * @example
     * ```typescript
     * node.clearSubscriptionChannelOrder();
     * ```
     */
    clearSubscriptionChannelOrder(): void;
  }
}

/**
 * Set the subscription channel order for this node.
 *
 * @param channelIds - Array of channel IDs in priority order
 */
ESPRMNode.prototype.setSubscriptionChannelOrder = function (
  channelIds: string[]
): void {
  if (!this.subscriptionConfig) {
    this.subscriptionConfig = {};
  }
  this.subscriptionConfig.channelOrder = channelIds;
};

/**
 * Get the effective subscription channel order for this node.
 *
 * @returns Array of channel IDs in priority order
 */
ESPRMNode.prototype.getSubscriptionChannelOrder = function (): string[] {
  return ESPRMBase.subscriptionManager.getEffectiveChannelOrder(this);
};

/**
 * Clear the node-specific subscription channel order.
 */
ESPRMNode.prototype.clearSubscriptionChannelOrder = function (): void {
  if (this.subscriptionConfig) {
    delete this.subscriptionConfig.channelOrder;
  }
};
