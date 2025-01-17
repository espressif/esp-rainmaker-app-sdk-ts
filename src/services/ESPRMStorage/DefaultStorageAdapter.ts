/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMStorageAdapterInterface } from "../../types/storage";

/**
 * Default implementation of storage adapter using browser's localStorage.
 */
export class DefaultStorageAdapter implements ESPRMStorageAdapterInterface {
  /**
   * Stores a key-value pair in localStorage.
   *
   * @param name - The key under which the value is stored.
   * @param value - The value to store.
   * @returns A promise that resolves when the item is stored.
   */
  async setItem(name: string, value: string): Promise<void> {
    window.localStorage.setItem(name, value);
  }

  /**
   * Retrieves a value from localStorage by its key.
   *
   * @param name - The key of the item to retrieve.
   * @returns A promise that resolves with the value associated with the key, or null if the key does not exist.
   */
  async getItem(name: string): Promise<string | null> {
    return window.localStorage.getItem(name);
  }

  /**
   * Removes a key-value pair from localStorage.
   *
   * @param name - The key of the item to remove.
   * @returns A promise that resolves when the item is removed.
   */
  async removeItem(name: string): Promise<void> {
    window.localStorage.removeItem(name);
  }

  /**
   * Clears all items from localStorage.
   *
   * @returns A promise that resolves when all items are cleared.
   */
  async clear(): Promise<void> {
    window.localStorage.clear();
  }
}
