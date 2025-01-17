/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMServiceParamInterface } from "./types/node";

/**
 * Represents a parameter associated with a service, including its name, value, and metadata.
 * Implements the `ESPRMServiceParamInterface`.
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

  /**
   * Creates an instance of `ESPRMServiceParam`.
   *
   * @param data - An object containing the parameter details.
   */
  constructor(data: ESPRMServiceParamInterface) {
    this.name = data.name;
    this.value = data.value;
    this.type = data.type;
    this.properties = data.properties;
    this.dataType = data.dataType;
  }
}
