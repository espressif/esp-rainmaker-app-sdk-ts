/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMNode } from "./ESPRMNode";
import { ESPRMDeviceParamInterface } from "./types/node";

/**
 * Represents a parameter associated with a device or node, including its name, value, and metadata.
 */
export class ESPRMDeviceParam implements ESPRMDeviceParamInterface {
  /** The name of the parameter. */
  name: string;

  /** The value of the parameter. */
  value?: any;

  /** The type of the parameter. */
  type: string;

  /** Additional properties related to the parameter. */
  properties: string[];

  /** The data type of the parameter. */
  dataType: string;

  /** Bounds for the parameter values. */
  bounds?: Record<string, any>;

  /** The valid string values of the parameter. */
  validStrings?: string[];

  /** Reference to ESPRMNode. */
  nodeRef: WeakRef<ESPRMNode>;

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
    this.name = data.name;
    this.value = data.value;
    this.type = data.type;
    this.properties = data.properties;
    this.dataType = data.dataType;
    this.bounds = data.bounds;
    this.validStrings = data.validStrings;
    this.nodeRef = new WeakRef(nodeRef);
    this.deviceName = data.deviceName;
    this.uiType = data.uiType;
  }
}
