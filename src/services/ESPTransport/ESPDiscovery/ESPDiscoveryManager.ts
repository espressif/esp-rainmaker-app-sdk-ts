/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMBase } from "../../../ESPRMBase";
import { ESPDiscoveryProtocol } from "../../../types/discovery";
import { ServiceType } from "../../../utils/constants";
import { DiscoveryParamsInterface } from "../ESPLocalDiscoveryAdapterInterface";

/**
 * Manages the discovery of devices using various discovery protocols
 * - Default is local discovery protocol which is used when no discovery config is provided.
 * - Custom discovery protocol is used when discovery config is provided.
 *
 * The `ESPDiscoveryManager` facilitates the initialization and management of discovery operations,
 * such as starting and stopping device discovery based on the custom protocol or default local discovery protocol.
 */
class ESPDiscoveryManager {
  /**
   * Represents discovery parameters.
   */
  params: DiscoveryParamsInterface;

  /**
   * Creates an instance of the `ESPDiscoveryManager` class.
   *
   * @param discoveryConfig - The discovery configuration to use, represented by {@link DiscoveryParamsInterface}.
   * @throws An error if the `ESPLocalDiscoveryAdapter` is not set in `ESPRMBase`.
   */
  constructor(discoveryConfig?: DiscoveryParamsInterface) {
    if (!ESPRMBase.ESPLocalDiscoveryAdapter) {
      throw Error("ESPLocalDiscoveryAdapter not set ");
    }
    this.params = discoveryConfig || {
      serviceType: ServiceType.ESP_LOCAL_CTRL_TCP,
      domain: ESPDiscoveryProtocol.local,
    };
  }

  /**
   * Starts the discovery process for devices.
   *
   * @param callback - A callback function that will be invoked with the results of the discovery process.
   */
  startDiscovery(callback: Function) {
    ESPRMBase.ESPLocalDiscoveryAdapter.startDiscovery(callback, this.params);
  }

  /**
   * Stops the ongoing discovery process.
   *
   * This method halts any ongoing discovery initiated by `startDiscovery`.
   */
  stopDiscovery() {
    ESPRMBase.ESPLocalDiscoveryAdapter.stopDiscovery();
  }
}

export { ESPDiscoveryManager };
