/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMStorageAdapterInterface } from "../../src/types/storage";

/**
 * Custom storage implementation for testing purposes.
 *
 * This custom storage adapter implements the ESPRMStorageAdapterInterface
 * and provides an in-memory storage solution for testing.
 */
const customStorage: Record<string, any> = {};

/**
 * Custom storage adapter implementing the ESPRMStorageAdapterInterface.
 *
 * Provides methods to set, get, remove, and clear items in the custom storage.
 */
const customStorageAdapter: ESPRMStorageAdapterInterface = {
  /**
   * Sets an item in the custom storage.
   *
   * @param {string} key - The key of the item to set.
   * @param {string} value - The value of the item to set.
   * @returns {Promise<void>}
   */
  async setItem(key: string, value: string): Promise<void> {
    customStorage[key] = value;
  },

  /**
   * Gets an item from the custom storage.
   *
   * @param {string} key - The key of the item to get.
   * @returns {Promise<string | null>} The value of the item, or null if not found.
   */
  async getItem(key: string): Promise<string | null> {
    return customStorage.hasOwnProperty(key) ? customStorage[key] : null;
  },

  /**
   * Removes an item from the custom storage.
   *
   * @param {string} key - The key of the item to remove.
   * @returns {Promise<void>}
   */
  async removeItem(key: string): Promise<void> {
    if (customStorage.hasOwnProperty(key)) {
      delete customStorage[key];
    }
  },

  /**
   * Clears all items from the custom storage.
   *
   * @returns {Promise<void>}
   */
  async clear(): Promise<void> {
    Object.keys(customStorage).forEach((key) => delete customStorage[key]);
  },
};

export { customStorageAdapter };
