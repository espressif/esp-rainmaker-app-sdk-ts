/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMAuth } from "../../src/ESPRMAuth";
import { ESPRMBaseConfig } from "../../src/types/input";
import { customStorageAdapter } from "./customStorageAdapter";
import { ESPRMBase } from "../../src/index";

/**
 * Configures and returns an instance of ESPRMAuth.
 *
 * This function sets up the ESPRMBase configuration using environment variables
 * and a custom storage adapter, then returns the ESPRMAuth instance.
 *
 * @returns {ESPRMAuth} The configured ESPRMAuth instance.
 *
 * @example
 * ```typescript
 * const authInstance = configureAuthInstance();
 * ```
 */
const configureAuthInstance = (): ESPRMAuth => {
  const config: ESPRMBaseConfig = {
    baseUrl: process.env.API_BASE_URL!,
    version: process.env.API_VERSION!,
    customStorageAdapter,
  };

  ESPRMBase.configure(config);
  return ESPRMBase.getAuthInstance();
};

export { configureAuthInstance };
