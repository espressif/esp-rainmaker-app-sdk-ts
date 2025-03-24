/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMUser } from "../../ESPRMUser";
import { ESPRMBase } from "../../ESPRMBase";
import { ESPProvError } from "../../utils/error/ESPProvError";
import { ProvErrorCodes } from "../../utils/constants";

/**
 * Augments the ESPRMUser class with the `stopESPDevicesSearch` method.
 */
declare module "../../ESPRMUser" {
  interface ESPRMUser {
    /**
     * Stop the search for ESP devices.
     */
    stopESPDevicesSearch(): Promise<void>;
  }
}

/**
 * Searches for ESP devices with the given prefix.
 * @param devicePrefix - The prefix of the device name to search for.
 * @returns A promise that resolves to an array of ESPDevice instances.
 */
ESPRMUser.prototype.stopESPDevicesSearch = async function (): Promise<void> {
  if (!ESPRMBase.ESPProvisionAdapter) {
    throw new ESPProvError(ProvErrorCodes.MISSING_PROV_ADAPTER);
  }
  await ESPRMBase.ESPProvisionAdapter.stopESPDevicesSearch();
};
