/*
 * SPDX-FileCopyrightText: 2026 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPSubscriptionManager } from "../ESPSubscriptionManager";
import { NotificationSubscriptionChannel } from "../ESPSubscriptionChannels/NotificationSubscriptionChannel";
import { SubscriptionChannelIds } from "../../utils/constants";

/**
 * Registers the notification subscription channel with the subscription manager if not already registered.
 *
 * @param subscriptionManager - The subscription manager instance.
 * @returns Promise that resolves when the channel is registered, or immediately if already registered.
 */
export function registerNotificationChannelIfNeeded(
  subscriptionManager: ESPSubscriptionManager
): Promise<void> {
  const isChannelRegistered = subscriptionManager
    .getRegisteredChannels()
    .includes(SubscriptionChannelIds.NOTIFICATION);

  if (isChannelRegistered) {
    return Promise.resolve();
  }

  return subscriptionManager.registerChannel(
    new NotificationSubscriptionChannel()
  );
}
