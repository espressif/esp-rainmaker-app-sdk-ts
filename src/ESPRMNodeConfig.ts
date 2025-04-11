/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMAttribute } from "./ESPRMAttribute";
import { ESPRMDevice } from "./ESPRMDevice";
import { ESPRMNode } from "./ESPRMNode";
import { ESPRMNodeInfo } from "./ESPRMNodeInfo";
import { ESPRMService } from "./ESPRMService";
import { ESPRMNodeConfigInterface } from "./types/node";

/**
 * Represents the configuration for a node, including its attributes, devices, and services.
 * Implements the `ESPRMNodeConfigInterface`.
 */
export class ESPRMNodeConfig implements ESPRMNodeConfigInterface {
  /** The version of the configuration. */
  configVersion: string;

  /** Optional attributes associated with the node configuration. */
  attributes?: ESPRMAttribute[];

  /** The devices associated with the node. */
  devices: ESPRMDevice[];

  /** Information related to the node. */
  info: ESPRMNodeInfo;

  /** Optional services associated with the node. */
  services?: ESPRMService[];

  /** Referance to ESPRMNode. */
  nodeRef: WeakRef<ESPRMNode>;

  /**
   * Creates an instance of `ESPRMNodeConfig`.
   *
   * @param data - An object containing the node configuration details.
   * @param nodeRef - Reference to the node this config belongs to
   */
  constructor(data: ESPRMNodeConfigInterface, nodeRef: ESPRMNode) {
    this.nodeRef = new WeakRef(nodeRef);
    this.configVersion = data.configVersion;
    this.attributes = data.attributes
      ? data.attributes.map((attr) => new ESPRMAttribute(attr))
      : [];
    this.devices = data.devices.map(
      (device) => new ESPRMDevice(device, nodeRef)
    );
    this.info = new ESPRMNodeInfo(data.info);
    this.services = data.services
      ? data.services.map((service) => new ESPRMService(service))
      : [];
  }
}
