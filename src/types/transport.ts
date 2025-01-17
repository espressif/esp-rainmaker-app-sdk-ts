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
  setDeviceParam(payload: Record<string, any>): Promise<ESPAPIResponse>;
  getDeviceParams(payload: Record<string, any>): Promise<Record<string, any>>;
}

export { ESPTransportMode, ESPTransportConfig, ESPTransportInterface };
