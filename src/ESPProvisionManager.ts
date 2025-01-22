/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPDevice } from "./ESPDevice";
import { ESPRMBase } from "./ESPRMBase";
import {
  ESPDeviceInterface,
  ESPSecurity,
  ESPTransport,
} from "./types/provision";

class ESPProvisionManager {
  /**
   * Searches for ESP devices with the given prefix.
   * @param devicePrefix - The prefix of the device name to search for.
   * @returns A promise that resolves to an array of ESPDevice instances.
   */
  async searchESPDevices(
    devicePrefix: string,
    transport: ESPTransport
  ): Promise<ESPDevice[]> {
    const espDevices = await ESPRMBase.ESPProvisionAdapter.searchESPDevices(
      devicePrefix,
      transport
    );

    return espDevices?.map(
      (espDevice: ESPDeviceInterface) => new ESPDevice(espDevice)
    );
  }

  /**
   * Creates an ESP device with the given parameters.
   * @param name - The name of the device.
   * @param transport - The transport type to use.
   * @param security - The security type to use (optional).
   * @param proofOfPossession - The proof of possession string (optional).
   * @param softAPPassword - The SoftAP password (optional).
   * @param username - The username (optional).
   * @returns A promise that resolves to an ESPDevice instance.
   */
  async createESPDevice(
    name: string,
    transport: ESPTransport,
    security?: ESPSecurity,
    proofOfPossession?: string,
    softAPPassword?: string,
    username?: string
  ): Promise<ESPDevice> {
    const espDevice = await ESPRMBase.ESPProvisionAdapter.createESPDevice(
      name,
      transport,
      security,
      proofOfPossession,
      softAPPassword,
      username
    );
    return new ESPDevice(espDevice);
  }

  /**
   * Stop the search for ESP devices.
   */
  async stopESPDevicesSearch(): Promise<void> {
    await ESPRMBase.ESPProvisionAdapter.stopESPDevicesSearch();
  }
}

export { ESPProvisionManager };
