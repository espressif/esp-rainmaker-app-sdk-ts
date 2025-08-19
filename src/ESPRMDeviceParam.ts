/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMParam } from "./ESPRMParam";
import { ESPRMNode } from "./ESPRMNode";
import { ESPRMDeviceParamInterface } from "./types/node";

/**
 * Represents a parameter associated with a device or node, including its name, value, and metadata.
 * Extends `ESPRMParam` and implements the `ESPRMDeviceParamInterface`.
 */
export class ESPRMDeviceParam
  extends ESPRMParam
  implements ESPRMDeviceParamInterface
{
  /** The name of the device to which this parameter belongs. */
  deviceName: string;

  /** The user interface type for the parameter. */
  uiType?: string;

  /**
   * Creates an instance of `ESPRMDeviceParam`.
   *
   * @param data - An object containing the parameter details.
   * @param nodeRef - Reference to the parent ESPRMNode.
   */
  constructor(data: ESPRMDeviceParamInterface, nodeRef: ESPRMNode) {
    // Call parent constructor with base parameter data
    super(data, nodeRef);

    // Set device-specific properties
    this.deviceName = data.deviceName;
    this.uiType = data.uiType;
  }
}
