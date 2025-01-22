/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Represents params respective to various discovery protocols.
 * @param serviceType - Represents discovery service type.
 * @param domain - Represents discovery domain.
 */
interface DiscoveryParamsInterface {
  serviceType: string;
  domain: string;
}

interface ESPLocalDiscoveryAdapterInterface {
  /**
   * Starts the discovery process.
   * @param callback - The function to call when a device is discovered
   * @param params - Represents params respective to various discovery protocols.
   */
  startDiscovery(callback: Function, params: DiscoveryParamsInterface): void;

  /**
   * Stops the discovery process.
   */
  stopDiscovery(): void;
}

export { ESPLocalDiscoveryAdapterInterface, DiscoveryParamsInterface };
