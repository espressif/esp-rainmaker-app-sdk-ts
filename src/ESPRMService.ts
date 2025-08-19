/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMServiceParam } from "./ESPRMServiceParam";
import { ESPRMServiceInterface } from "./types/node";
import { ESPRMNode } from "./ESPRMNode";

/**
 * Represents a service associated with a device or node, including its name, parameters, and type.
 * Implements the `ESPRMServiceInterface`.
 */
export class ESPRMService implements ESPRMServiceInterface {
  /** The name of the service. */
  name: string;

  /** The parameters associated with the service. */
  params: ESPRMServiceParam[];

  /** The type of the service. */
  type: string;

  /** Reference to ESPRMNode. */
  nodeRef: WeakRef<ESPRMNode>;

  /**
   * Creates an instance of `ESPRMService`.
   *
   * @param data - An object containing the service details.
   */
  constructor(data: ESPRMServiceInterface, nodeRef: ESPRMNode) {
    this.name = data.name;
    this.params = data.params.map(
      (param) => new ESPRMServiceParam(param, nodeRef)
    );
    this.type = data.type;
    this.nodeRef = new WeakRef(nodeRef);
  }
}
