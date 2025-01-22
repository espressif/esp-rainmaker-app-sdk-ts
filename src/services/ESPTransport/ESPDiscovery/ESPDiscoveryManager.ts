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
 * Manages the discovery of devices using various discovery protocols.
 *
 * The `ESPDiscoveryManager` facilitates the initialization and management of discovery operations,
 * such as starting and stopping device discovery based on the specified protocol.
 */
class ESPDiscoveryManager {
  /**
   * Represents discovery parameters.
   */
  params: DiscoveryParamsInterface;

  /**
   * Creates an instance of the `ESPDiscoveryManager` class.
   *
   * @param type - The discovery protocol to use, represented by {@link ESPDiscoveryProtocol}.
   * @throws An error if the `ESPLocalDiscoveryAdapter` is not set in `ESPRMBase`.
   */
  constructor(type: ESPDiscoveryProtocol) {
    if (!ESPRMBase.ESPLocalDiscoveryAdapter) {
      throw Error("ESPLocalDiscoveryAdapter not set ");
    }
    switch (type) {
      case ESPDiscoveryProtocol.local: {
        this.params = {
          serviceType: ServiceType.ESP_LOCAL_CTRL_TCP,
          domain: ESPDiscoveryProtocol.local,
        };
      }
    }
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
