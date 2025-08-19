/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMDevice } from "../../ESPRMDevice";
import { ESPRMDeviceParam } from "../../ESPRMDeviceParam";

/**
 * Augments the ESPRMDevice class with the `getPrimaryParam` method.
 */
declare module "../../ESPRMDevice" {
  interface ESPRMDevice {
    /**
     * Gets the primary parameter for the current device.
     *
     * The primary device parameter if it exists, undefined otherwise.
     * @returns {ESPRMDeviceParam | undefined}
     */
    getPrimaryParam(): ESPRMDeviceParam | undefined;
  }
}

/**
 * Gets the primary parameter for the current device by matching the primary parameter name.
 *
 * The primary device parameter if it exists, undefined otherwise.
 * @returns {ESPRMDeviceParam | undefined}
 */
ESPRMDevice.prototype.getPrimaryParam = function ():
  | ESPRMDeviceParam
  | undefined {
  return this.primaryParam;
};
