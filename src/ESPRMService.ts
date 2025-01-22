/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMServiceParam } from "./ESPRMServiceParam";
import { ESPRMServiceInterface } from "./types/node";

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

  /**
   * Creates an instance of `ESPRMService`.
   *
   * @param data - An object containing the service details.
   */
  constructor(data: ESPRMServiceInterface) {
    this.name = data.name;
    this.params = data.params.map((param) => new ESPRMServiceParam(param));
    this.type = data.type;
  }
}
