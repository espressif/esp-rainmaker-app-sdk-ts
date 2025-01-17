/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMAttributeInterface } from "./types/node";

/**
 * Represents an attribute with a name and value.
 * Implements the `ESPRMAttributeInterface`.
 */
export class ESPRMAttribute implements ESPRMAttributeInterface {
  /** The name of the attribute. */
  name: string;

  /** The value of the attribute. */
  value?: any;

  /**
   * Creates an instance of `ESPRMAttribute`.
   *
   * @param data - An object containing the name and value of the attribute.
   */
  constructor(data: ESPRMAttributeInterface) {
    this.name = data.name;
    this.value = data.value;
  }
}
