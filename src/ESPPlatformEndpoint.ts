/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPPlatformEndpointInterface } from "./types/ESPModules";

/**
 * Represents a platform endpoint for push notifications.
 *
 * The `ESPPlatformEndpoint` class is a concrete implementation of the
 * `ESPPlatformEndpointInterface`. It encapsulates details about the platform
 * endpoint, such as the device token, endpoint ARN, application ARN, and platform type.
 */
export class ESPPlatformEndpoint implements ESPPlatformEndpointInterface {
  /**
   * The device token associated with the platform endpoint.
   */
  deviceToken: string;

  /**
   * The Amazon Resource Name (ARN) of the platform endpoint.
   */
  endpoint: string;

  /**
   * The Amazon Resource Name (ARN) of the platform application.
   */
  applicationARN: string;

  /**
   * The type of platform.
   */
  platform?: string;

  /**
   * Creates an instance of `ESPPlatformEndpoint`.
   *
   * @param data - An object implementing the `ESPPlatformEndpointInterface`
   * that contains the platform endpoint details.
   */
  constructor(data: ESPPlatformEndpointInterface) {
    this.deviceToken = data.deviceToken;
    this.endpoint = data.endpoint;
    this.applicationARN = data.applicationARN;
    this.platform = data.platform;
  }
}
