/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMUser } from "../../ESPRMUser";
import { ESPDevice } from "../../ESPDevice";
import { ESPRMBase } from "../../ESPRMBase";
import { ESPDeviceInterface, ESPTransport } from "../../types/provision";
import { ESPProvError } from "../../utils/error/ESPProvError";
import { AppPermissionErrorCodes, ProvErrorCodes } from "../../utils/constants";
import { ESPAppPermissionError } from "../../utils/error/ESPAppPermissionError";

/**
 * Augments the ESPRMUser class with the `searchESPDevices` method.
 */
declare module "../../ESPRMUser" {
  interface ESPRMUser {
    /**
     * Searches for ESP devices with the given prefix.
     * @param devicePrefix - The prefix of the device name to search for.
     * @returns A promise that resolves to an array of ESPDevice instances.
     */
    searchESPDevices(
      devicePrefix: string,
      transport: ESPTransport
    ): Promise<ESPDevice[]>;
  }
}

/**
 * Searches for ESP devices with the given prefix.
 * @param devicePrefix - The prefix of the device name to search for.
 * @returns A promise that resolves to an array of ESPDevice instances.
 */
ESPRMUser.prototype.searchESPDevices = async function (
  devicePrefix: string,
  transport: ESPTransport
): Promise<ESPDevice[]> {
  if (transport === ESPTransport.ble && ESPRMBase.ESPAppUtilityAdapter) {
    const isBlePermissionGranted =
      await ESPRMBase.ESPAppUtilityAdapter.isBlePermissionGranted();
    if (!isBlePermissionGranted) {
      throw new ESPAppPermissionError(
        AppPermissionErrorCodes.BLE_PERMISSION_NOT_GRANTED
      );
    }
  }

  if (!ESPRMBase.ESPProvisionAdapter) {
    throw new ESPProvError(ProvErrorCodes.MISSING_PROV_ADAPTER);
  }
  const espDevices = await ESPRMBase.ESPProvisionAdapter.searchESPDevices(
    devicePrefix,
    transport
  );

  return espDevices?.map(
    (espDevice: ESPDeviceInterface) => new ESPDevice(espDevice)
  );
};
