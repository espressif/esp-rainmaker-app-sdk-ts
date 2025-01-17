/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Enum for ESP Rainmaker Event Types.
 * This enum defines the types of events that can be used in event subscriptions.
 */
enum ESPRMEventType {
  localDiscovery = "com.espressif.event.localDiscovery",
  nodeUpdates = "com.espressif.event.nodeUpdates",
}

export { ESPRMEventType };
