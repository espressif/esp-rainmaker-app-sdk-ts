/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMBase } from "../../ESPRMBase";
import { ESPRMNode } from "../../ESPRMNode";
import {
  ESPNodeUpdateData,
  ESPSubscriptionChannelInterface,
} from "../../types/subscription";
import { transformNotificationData } from "../ESPRMHelpers/TransformNotificationData";
import { SubscriptionChannelIds } from "../../utils/constants";

/**
 * Subscription channel that wraps the existing notification adapter.
 * Provides backward compatibility with the current push notification system.
 *
 * This channel:
 * - Supports all nodes (notifications are generic)
 * - Uses the existing ESPNotificationAdapter
 * - Transforms notification data to standard ESPNodeUpdateData format
 * - Handles both iOS (APNS) and Android (FCM/GCM) notifications
 *
 * @example
 * ```typescript
 * const notificationChannel = new NotificationSubscriptionChannel();
 * await ESPRMBase.subscriptionManager.registerChannel(notificationChannel);
 * ```
 */
export class NotificationSubscriptionChannel
  implements ESPSubscriptionChannelInterface
{
  readonly channelId = SubscriptionChannelIds.NOTIFICATION;

  /**
   * Map of callbacks for specific nodes (nodeId -> Set of callbacks)
   */
  private callbacks: Map<string, Set<(update: ESPNodeUpdateData) => void>> =
    new Map();

  /**
   * Global notification listener that receives all notifications
   */
  private globalCallback?: (info: Record<string, any>) => void;

  /**
   * Whether the channel has been initialized
   */
  private isInitialized: boolean = false;

  /**
   * Initialize the notification channel.
   * Sets up the global notification listener.
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    if (!ESPRMBase.ESPNotificationAdapter) {
      throw new Error(
        "Notification adapter not configured. Please set ESPRMBase.ESPNotificationAdapter before initializing."
      );
    }

    this.globalCallback = (info: Record<string, any>) => {
      const notificationData = transformNotificationData(info);
      if (!notificationData) {
        return;
      }

      const update: ESPNodeUpdateData = {
        nodeId: notificationData.node_id,
        source: this.channelId,
        eventType:
          notificationData.event_type || "rmaker.event.node_params_changed",
        payload: notificationData.payload,
        metadata: {
          platform: info.aps ? "ios" : "android",
          timestamp: notificationData.timestamp,
        },
      };

      const nodeCallbacks = this.callbacks.get(update.nodeId);
      if (nodeCallbacks && nodeCallbacks.size > 0) {
        nodeCallbacks.forEach((cb) => cb(update));
      }

      const globalCallbacks = this.callbacks.get("*");
      if (globalCallbacks && globalCallbacks.size > 0) {
        globalCallbacks.forEach((cb) => cb(update));
      }
    };

    ESPRMBase.ESPNotificationAdapter.addNotificationListener(
      this.globalCallback
    );

    this.isInitialized = true;
  }

  /**
   * Check if this channel supports a specific node.
   * Notifications are generic and support all nodes.
   *
   * @param _node - The node to check support for (unused - notifications support all nodes)
   * @returns Always returns true (notifications support all nodes)
   */
  supportsNode(_node: ESPRMNode): boolean {
    return true;
  }

  /**
   * Subscribe to notification updates for a specific node or all nodes.
   *
   * @param callback - Function to call when notifications are received
   * @param nodeId - Optional node ID. If provided, only notifications for this node trigger the callback
   * @throws Error if notification adapter is not configured
   */
  async subscribe(
    callback: (update: ESPNodeUpdateData) => void,
    nodeId?: string
  ): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const key = nodeId || "*";

    if (!this.callbacks.has(key)) {
      this.callbacks.set(key, new Set());
    }

    this.callbacks.get(key)!.add(callback);
  }

  /**
   * Unsubscribe from notification updates for a specific node or all nodes.
   *
   * @param nodeId - Optional node ID. If not provided, unsubscribes from all nodes
   */
  async unsubscribe(nodeId?: string): Promise<void> {
    if (nodeId) {
      this.callbacks.delete(nodeId);
    } else {
      this.callbacks.clear();
    }
  }

  /**
   * Cleanup and dispose of notification channel resources.
   * Removes the native notification listener and clears all callbacks.
   */
  async dispose(): Promise<void> {
    if (this.globalCallback && ESPRMBase.ESPNotificationAdapter) {
      ESPRMBase.ESPNotificationAdapter.removeNotificationListener(
        this.globalCallback
      );
    }
    this.callbacks.clear();
    this.globalCallback = undefined;
    this.isInitialized = false;
  }
}
