/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMParamInterface } from "./types/node";
import { ESPRMNode } from "./ESPRMNode";
import { ESPAPIResponse } from "./types/output";

/**
 * Base class for parameters with common properties and functionality.
 * Contains shared properties like
 * - name
 * - value
 * - type
 * - properties
 * - dataType
 * - bounds
 * - nodeRef
 * - setValue method is abstract and must be implemented by subclasses.
 */
export abstract class ESPRMParam implements ESPRMParamInterface {
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

  /**
   * Creates an instance of `ESPRMParam`.
   *
   * @param data - An object containing the base parameter details.
   * @param nodeRef - Reference to the parent ESPRMNode.
   */
  constructor(data: ESPRMParamInterface, nodeRef: ESPRMNode) {
    this.name = data.name;
    this.value = data.value;
    this.type = data.type;
    this.properties = data.properties;
    this.dataType = data.dataType;
    this.bounds = data.bounds;
    this.validStrings = data.validStrings;
    this.nodeRef = new WeakRef(nodeRef);
  }

  /**
   * Sets the value of the parameter.
   *
   * @param value - The new value to set for the parameter.
   * @returns A promise that resolves when the value is set.
   */
  abstract setValue(value: any): Promise<ESPAPIResponse>;
}
