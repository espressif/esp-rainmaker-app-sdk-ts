/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMNodeInfoInterface } from "./types/node";

/**
 * Represents information about a node, including its name, type, model, and firmware version.
 * Implements the `ESPRMNodeInfoInterface`.
 */
export class ESPRMNodeInfo implements ESPRMNodeInfoInterface {
  /** The name of the node. */
  name: string;

  /** The type of the node. */
  type: string;

  /** The model of the node. */
  model: string;

  /** The firmware version of the node. */
  firmwareVersion: string;

  /**
   * Creates an instance of `ESPRMNodeInfo`.
   *
   * @param data - An object containing the node information details.
   */
  constructor(data: ESPRMNodeInfoInterface) {
    this.name = data.name;
    this.type = data.type;
    this.model = data.model;
    this.firmwareVersion = data.firmwareVersion;
  }
}
