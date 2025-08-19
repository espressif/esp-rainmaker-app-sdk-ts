/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPAPIResponse } from "./output";

/**
 * Defines the transport mode for ESP device communication.
 *
 * The transport mode specifies whether the communication is done locally
 * or through the cloud.
 */
enum ESPTransportMode {
  /** Communication is handled locally, without cloud intervention. */
  local = "local",

  /** Communication is routed through the cloud. */
  cloud = "cloud",
}

/**
 * Configuration options for setting up the transport mechanism for ESP communication.
 *
 * This configuration includes the type of transport and any additional metadata
 * required for the specified mode.
 */
interface ESPTransportConfig {
  /** The transport mode, specifying if the communication is local or cloud-based. */
  type: ESPTransportMode;

  /**
   * Additional metadata for the transport configuration.
   *
   * This can include any key-value pairs relevant to the chosen transport mode.
   */
  metadata: Record<string, any>;
}

interface ESPTransportInterface {
  /**
   * Sets a parameter value on the node.
   * @param payload - The payload containing parameters to set.
   * @returns A promise that resolves to the API response.
   */
  setParam(payload: Record<string, any>): Promise<ESPAPIResponse>;

  /**
   * Gets parameters from the node.
   * @param payload - The payload containing parameters to get.
   * @returns A promise that resolves to the API response.
   */
  getParams(payload: Record<string, any>): Promise<Record<string, any>>;
}

export { ESPTransportMode, ESPTransportConfig, ESPTransportInterface };
