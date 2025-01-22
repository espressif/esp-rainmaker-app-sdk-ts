/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

interface ESPNotificationAdapterInterface {
  /**
   * Retrieves delivered notifications.
   * @param callback - The function to call with the delivered notifications.
   */
  addNotificationListener(callback: Function): void;
}

export { ESPNotificationAdapterInterface };
