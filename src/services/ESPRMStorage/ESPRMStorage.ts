/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMBase } from "../../ESPRMBase";
import { ESPRMStorageAdapterInterface } from "../../types/storage";
import { StorageAdapterErrorCodes } from "../../utils/constants";
import { ESPStorageAdapterError } from "../../utils/error/Error";
import { DefaultStorageAdapter } from "./DefaultStorageAdapter";

/**
 * Manages storage operations using a configurable storage adapter.
 */
export class ESPRMStorage {
  /** Singleton instance of ESPRMStorage */
  static #instance: ESPRMStorage;

  /** Storage adapter used for storage operations */
  #storageAdapter: ESPRMStorageAdapterInterface;

  /**
   * Private constructor to initialize the storage adapter based on configuration.
   */
  constructor() {
    const customStorageAdapter = ESPRMBase.ESPStorageAdapter;

    if (customStorageAdapter) {
      this.#storageAdapter = customStorageAdapter;
      return;
    }
    if (
      typeof window === "undefined" ||
      typeof window.localStorage === "undefined"
    ) {
      throw new ESPStorageAdapterError(
        StorageAdapterErrorCodes.UNSUPPORTED_DEFAULT_STORAGE_ADAPTER_API
      );
    }
    this.#storageAdapter = new DefaultStorageAdapter();
  }

  /**
   * Initializes the singleton instance of ESPRMStorage.
   */
  static initialize() {
    ESPRMStorage.#instance = new ESPRMStorage();
  }

  /**
   * Gets the singleton instance of ESPRMStorage.
   *
   * @returns The singleton instance of ESPRMStorage.
   */
  static #getInstance(): ESPRMStorage {
    return ESPRMStorage.#instance;
  }

  /**
   * Sets an item in the storage.
   *
   * @param name - The name of the item.
   * @param value - The value to store.
   */
  static setItem(name: string, value: string) {
    const instance = ESPRMStorage.#getInstance();
    instance.#storageAdapter.setItem(name, value);
  }

  /**
   * Retrieves an item from the storage.
   *
   * @param name - The name of the item.
   * @returns A promise that resolves with the value of the item or null if not found.
   */
  static getItem(name: string): Promise<string | null> {
    const instance = ESPRMStorage.#getInstance();
    return instance.#storageAdapter.getItem(name);
  }

  /**
   * Removes an item from the storage.
   *
   * @param name - The name of the item.
   */
  static removeItem(name: string) {
    const instance = ESPRMStorage.#getInstance();
    instance.#storageAdapter.removeItem(name);
  }

  /**
   * Clears all items from the storage.
   */
  static clear() {
    const instance = ESPRMStorage.#getInstance();
    instance.#storageAdapter.clear();
  }
}
