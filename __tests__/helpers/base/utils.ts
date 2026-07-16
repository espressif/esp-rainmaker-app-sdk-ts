/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMBaseConfig } from "../../../src/types/input";

/**
 * Mock base configuration for testing
 */
export const MOCK_BASE_CONFIG: ESPRMBaseConfig = {
  baseUrl: "https://test.api.com",
  version: "v1",
};

/**
 * Mock claim base URL for testing
 */
export const MOCK_CLAIM_URL = "https://test.claiming.api.com";

/**
 * Mock base configuration with claim base URL for testing
 */
export const MOCK_BASE_CONFIG_WITH_CLAIM_URL: ESPRMBaseConfig = {
  ...MOCK_BASE_CONFIG,
  claimUrl: MOCK_CLAIM_URL,
};

/**
 * Mock MQTT hosts for testing
 */
export const MOCK_MQTT_HOSTS = {
  PRIMARY: "mqtt.rainmaker.espressif.com",
} as const;

/**
 * Mock API responses for MQTT host requests
 */
export const MOCK_MQTT_RESPONSES = {
  SUCCESS: {
    mqtt_host: MOCK_MQTT_HOSTS.PRIMARY,
  },
} as const;
