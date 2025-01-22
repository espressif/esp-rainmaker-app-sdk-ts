/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPAPIResponse } from "../../types/output";
import {
  ESPTransportConfig,
  ESPTransportInterface,
  ESPTransportMode,
} from "../../types/transport";
import { ESPCloudTransport } from "./ESPCloudTransport";
import { ESPLocalControlTransport } from "./ESPLocalControlTransport";

/**
 * Manages the transport layer for ESP device communication, allowing
 * configuration of local or cloud-based transport modes.
 *
 * This class abstracts the underlying transport mechanism and provides methods
 * for setting and retrieving device parameters.
 */
class ESPTransportManager {
  /** Holds the transport configuration for the manager instance. */
  private transport!: ESPTransportInterface;

  /**
   * Creates an instance of `ESPTransportManager` with a specified transport configuration.
   *
   * @param transportConfig - The configuration specifying the type of transport (local or cloud)
   * and any additional metadata.
   * @param transportObj - The object representing custom transport.
   */

  constructor(
    transportConfig?: ESPTransportConfig,
    transportObj?: ESPTransportInterface
  ) {
    if (transportConfig) {
      switch (transportConfig.type) {
        case ESPTransportMode.cloud:
          this.transport = new ESPCloudTransport();
          break;
        case ESPTransportMode.local:
          this.transport = new ESPLocalControlTransport(transportConfig);
          break;
        default:
          throw new Error(
            `Unsupported transport type: ${transportConfig.type}`
          );
      }
    } else if (transportObj) {
      this.transport = transportObj;
    }
  }

  /**
   * Sets a parameter on the device using the configured transport mechanism.
   *
   * @param payload - A record containing the parameter data to set on the device.
   * @returns A promise that resolves to the response of the set operation.
   */
  async setDeviceParam(payload: Record<string, any>): Promise<ESPAPIResponse> {
    return this.transport.setDeviceParam(payload);
  }

  /**
   * Retrieves parameters from the device using the configured transport mechanism.
   *
   * @param payload - A record containing the data required to retrieve device parameters.
   * @returns A promise that resolves to a record of the device parameters.
   */
  async getDeviceParams(
    payload: Record<string, any>
  ): Promise<Record<string, any>> {
    return this.transport.getDeviceParams(payload);
  }
}

export { ESPTransportManager };
