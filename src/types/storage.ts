/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Interface for a storage adapter, allowing for various implementations
 * such as localStorage, sessionStorage, or custom storage mechanisms.
 */
interface ESPRMStorageAdapterInterface {
  /**
   * Stores a value under the specified name.
   * @param name - The key under which the value will be stored.
   * @param value - The value to store.
   * @returns A promise that resolves when the value is stored.
   */
  setItem(name: string, value: string): Promise<void>;

  /**
   * Retrieves a stored value by its name.
   * @param name - The key associated with the value to retrieve.
   * @returns A promise that resolves with the retrieved value, or null if not found.
   */
  getItem(name: string): Promise<string | null>;

  /**
   * Removes the stored value associated with the specified name.
   * @param name - The key of the value to remove.
   * @returns A promise that resolves when the value is removed.
   */
  removeItem(name: string): Promise<void>;

  /**
   * Clears all stored values.
   * @returns A promise that resolves when all values are cleared.
   */
  clear(): Promise<void>;
}

export { ESPRMStorageAdapterInterface };
