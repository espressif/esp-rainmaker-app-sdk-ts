/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMUser } from "../../ESPRMUser";
import { ESPDevice } from "../../ESPDevice";
import { ESPTransport } from "../../types/provision";

/**
 * Augments the ESPRMUser class with the `searchESPBLEDevices` method.
 */
declare module "../../ESPRMUser" {
  interface ESPRMUser {
    /**
     * Searches for ESP BLE devices with the given customer ID.
     * @param customerId - The customer ID to search for.
     * @returns A promise that resolves to an array of ESPDevice instances.
     */
    searchESPBLEDevices(customerId: number): Promise<ESPDevice[]>;
  }
}

/**
 * Searches for ESP BLE devices with the given customer ID.
 * @param customerId - The customer ID to search for.
 * @returns A promise that resolves to an array of ESPDevice instances.
 */
ESPRMUser.prototype.searchESPBLEDevices = async function (
  customerId: number
): Promise<ESPDevice[]> {
  const espDevices = await this.searchESPDevices("", ESPTransport.ble);

  const filteredESPDevices = espDevices?.filter((espDevice: ESPDevice) => {
    if (!espDevice.advertisementData) {
      return false;
    }

    const advertisementData: { [key: string]: any } =
      espDevice.advertisementData;

    if (!advertisementData || !advertisementData.kCBAdvDataManufacturerData) {
      return false;
    }

    const dataArray = advertisementData.kCBAdvDataManufacturerData;

    if (dataArray.length < 10) {
      return false;
    }

    // Check for ESP manufacturer signature (0x4e, 0x6f, 0x76 = "Nov") at offset 0 or 2
    const novAt0 =
      dataArray.length >= 3 &&
      dataArray[0] === 0x4e &&
      dataArray[1] === 0x6f &&
      dataArray[2] === 0x76;
    const novAt2 =
      dataArray.length >= 5 &&
      dataArray[2] === 0x4e &&
      dataArray[3] === 0x6f &&
      dataArray[4] === 0x76;
    const off = novAt0 ? 0 : novAt2 ? 2 : -1;

    if (off < 0 || dataArray.length < off + 10) {
      return false;
    }

    const deviceCustomerId =
      ((dataArray[off + 4] ?? 0) << 8) | (dataArray[off + 5] ?? 0);

    return deviceCustomerId === customerId;
  });

  return filteredESPDevices;
};
