/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMParam } from "./ESPRMParam";
import { ESPRMServiceParamInterface } from "./types/node";
import { ESPRMNode } from "./ESPRMNode";

/**
 * Represents a parameter associated with a service, including its name, value, and metadata.
 * and has a serviceName property to identify the service it belongs to.
 * Extends `ESPRMParam` and implements the `ESPRMServiceParamInterface`.
 */
export class ESPRMServiceParam
  extends ESPRMParam
  implements ESPRMServiceParamInterface
{
  /**
   * Name of the service.
   */
  serviceName: string;

  /**
   * Creates an instance of `ESPRMServiceParam`.
   *
   * @param data - An object containing the parameter details.
   */
  constructor(data: ESPRMServiceParamInterface, nodeRef: ESPRMNode) {
    // Call parent constructor with base parameter data
    super(data, nodeRef);
    this.serviceName = data.serviceName;
  }
}
