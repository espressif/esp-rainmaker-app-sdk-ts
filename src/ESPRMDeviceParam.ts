/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMNode } from "./ESPRMNode";
import { ESPRMDeviceParamInterface } from "./types/node";

/**
 * Represents a parameter associated with a device or node, including its name, value, and metadata.
 * Implements the `ESPRMDeviceParamInterface`.
 */
export class ESPRMDeviceParam implements ESPRMDeviceParamInterface {
  /** The name of the device to which this parameter belongs. */
  deviceName: string;

  /** The name of the parameter. */
  name: string;

  /** The value of the parameter. */
  value?: any;

  /** The type of the parameter. */
  type: string;

  /** The user interface type for the parameter. */
  uiType: string;

  /** Additional properties related to the parameter. */
  properties: string[];

  /** Bounds for the parameter values. */
  bounds: Record<string, any>;

  /** The data type of the parameter. */
  dataType: string;

  /** Referance to ESPRMNode. */
  nodeRef: WeakRef<ESPRMNode>;

  /**
   * Creates an instance of `ESPRMDeviceParam`.
   *
   * @param data - An object containing the parameter details.
   */
  constructor(data: ESPRMDeviceParamInterface, nodeRef: ESPRMNode) {
    this.deviceName = data.deviceName;
    this.name = data.name;
    this.value = data.value;
    this.type = data.type;
    this.uiType = data.uiType;
    this.properties = data.properties;
    this.bounds = data.bounds || [];
    this.dataType = data.dataType;
    this.nodeRef = new WeakRef(nodeRef);
  }
}
