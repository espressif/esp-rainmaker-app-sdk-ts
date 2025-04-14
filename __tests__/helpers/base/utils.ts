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
