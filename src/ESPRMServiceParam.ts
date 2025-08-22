/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMServiceParamInterface } from "./types/node";
import { ESPRMNode } from "./ESPRMNode";

/**
 * Represents a parameter associated with a service, including its name, value, and metadata.
 * Has a serviceName property to identify the service it belongs to.
 */
export class ESPRMServiceParam implements ESPRMServiceParamInterface {
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

  /** The name of the service to which this parameter belongs. */
  serviceName: string;

  /**
   * Creates an instance of `ESPRMServiceParam`.
   *
   * @param data - An object containing the parameter details.
   * @param nodeRef - Reference to the parent ESPRMNode.
   */
  constructor(data: ESPRMServiceParamInterface, nodeRef: ESPRMNode) {
    this.name = data.name;
    this.value = data.value;
    this.type = data.type;
    this.properties = data.properties;
    this.dataType = data.dataType;
    this.bounds = data.bounds;
    this.validStrings = data.validStrings;
    this.nodeRef = new WeakRef(nodeRef);
    this.serviceName = data.serviceName;
  }
}
