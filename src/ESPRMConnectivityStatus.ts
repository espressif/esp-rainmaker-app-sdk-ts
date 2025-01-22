/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMConnectivityStatusInterface } from "./types/node";

/**
 * Represents the connectivity status of a device.
 * Implements the `ESPRMConnectivityStatusInterface`.
 */
export class ESPRMConnectivityStatus
  implements ESPRMConnectivityStatusInterface
{
  /** Indicates whether the device is currently connected. */
  isConnected: boolean;

  /** The timestamp of the last connection, represented as a Unix timestamp. */
  lastConnectionTimestamp: number;

  /**
   * Creates an instance of `ESPRMConnectivityStatus`.
   *
   * @param data - An object containing the connectivity status details.
   */
  constructor(data: ESPRMConnectivityStatusInterface) {
    this.isConnected = data.isConnected;
    this.lastConnectionTimestamp = data.lastConnectionTimestamp;
  }
}
