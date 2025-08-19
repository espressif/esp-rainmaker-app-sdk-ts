/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMUser } from "../../ESPRMUser";
import { ESPDevice } from "../../ESPDevice";
import { ESPRMBase } from "../../ESPRMBase";
import {
  ESPDeviceInterface,
  ESPSecurity,
  ESPTransport,
} from "../../types/provision";
import { ESPProvError } from "../../utils/error/ESPProvError";
import { AppPermissionErrorCodes, ProvErrorCodes } from "../../utils/constants";
import { ESPAppPermissionError } from "../../utils/error/ESPAppPermissionError";

/**
 * Augments the ESPRMUser class with the `createESPDevice` method.
 */
declare module "../../ESPRMUser" {
  interface ESPRMUser {
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
    createESPDevice(
      name: string,
      transport: ESPTransport,
      security?: ESPSecurity,
      proofOfPossession?: string,
      softAPPassword?: string,
      username?: string
    ): Promise<ESPDevice>;
  }
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
ESPRMUser.prototype.createESPDevice = async function (
  name: string,
  transport: ESPTransport,
  security?: ESPSecurity,
  proofOfPossession?: string,
  softAPPassword?: string,
  username?: string
): Promise<ESPDevice> {
  if (ESPRMBase.ESPAppUtilityAdapter) {
    if (transport === ESPTransport.softap) {
      const isLocationPermissionGranted =
        await ESPRMBase.ESPAppUtilityAdapter.isLocationPermissionGranted();
      if (!isLocationPermissionGranted) {
        throw new ESPAppPermissionError(
          AppPermissionErrorCodes.LOCATION_PERMISSION_NOT_GRANTED
        );
      }
    } else if (transport === ESPTransport.ble) {
      const isBlePermissionGranted =
        await ESPRMBase.ESPAppUtilityAdapter.isBlePermissionGranted();
      if (!isBlePermissionGranted) {
        throw new ESPAppPermissionError(
          AppPermissionErrorCodes.BLE_PERMISSION_NOT_GRANTED
        );
      }
    }
  }
  if (!ESPRMBase.ESPProvisionAdapter) {
    throw new ESPProvError(ProvErrorCodes.MISSING_PROV_ADAPTER);
  }
  const espDevice: ESPDeviceInterface =
    await ESPRMBase.ESPProvisionAdapter.createESPDevice(
      name,
      transport,
      security,
      proofOfPossession,
      softAPPassword,
      username
    );
  return new ESPDevice(espDevice);
};
