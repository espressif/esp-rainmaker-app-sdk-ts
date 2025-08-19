/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMAttribute } from "./ESPRMAttribute";
import { ESPRMDeviceParam } from "./ESPRMDeviceParam";
import { ESPRMNode } from "./ESPRMNode";
import { ESPRMDeviceInterface } from "./types/node";

/**
 * Represents a device with its associated attributes and parameters.
 * Implements the `ESPRMDeviceInterface`.
 */
export class ESPRMDevice implements ESPRMDeviceInterface {
  /** The name of the device. */
  name: string;

  /** The display name of the device. */
  displayName: string;

  /** The type of the device. */
  type: string;

  /** Optional attributes associated with the device. */
  attributes?: ESPRMAttribute[];

  /** Optional parameters associated with the device. */
  params?: ESPRMDeviceParam[];

  /** The primary parameter of the device. */
  primaryParam?: ESPRMDeviceParam;

  /**  Referance to ESPRMNode. */
  nodeRef: WeakRef<ESPRMNode>;
  /**
   * Creates an instance of `ESPRMDevice`.
   *
   * @param data - An object containing the device details.
   */
  constructor(data: ESPRMDeviceInterface, nodeRef: ESPRMNode) {
    this.nodeRef = new WeakRef(nodeRef);
    this.name = data.name;
    this.displayName = data.displayName;
    this.type = data.type;
    this.attributes = data.attributes
      ? data.attributes.map((attr) => new ESPRMAttribute(attr))
      : [];
    this.params = data.params
      ? data.params.map((param) => new ESPRMDeviceParam(param, nodeRef))
      : [];

    this.primaryParam = data.primaryParam
      ? new ESPRMDeviceParam(data.primaryParam, nodeRef)
      : undefined;
  }
}
