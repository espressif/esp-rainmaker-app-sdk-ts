/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMAuth } from "./ESPRMAuth";

import { ESPRMAPIManager } from "./services/ESPRMAPIManager";
import { ESPRMStorage } from "./services/ESPRMStorage/ESPRMStorage";
import { ConfigValidator } from "./utils/validator/ConfigValidator";
import { ESPRMBaseConfig, ESPRMAPIManagerConfig } from "./types/input";

import packageInfo from "../package.json";
import {
  ConfigErrorCodes,
  DEFAULT_REST_API_VERSION,
  APIEndpoints,
  HTTPMethods,
  APIResponseFields,
} from "./utils/constants";
import { ESPConfigError } from "./utils/error/Error";
import { ESPProvisionAdapterInterface } from "./types/provision";
import { ESPTransportMode } from "./types/transport";
import { ESPLocalDiscoveryAdapterInterface } from "./services/ESPTransport/ESPLocalDiscoveryAdapterInterface";
import { ESPLocalControlAdapterInterface } from "./services/ESPTransport/ESPLocalControlAdapterInterface";
import {
  ESPNotificationAdapterInterface,
  ESPOauthAdapterInterface,
} from "./types/adapter";
import { ESPRMStorageAdapterInterface } from "./types/storage";
import { isValidEnumValue } from "./services/ESPRMHelpers/IsValidEnumValue";

/**
 * Base class for configuring and managing the ESP Rainmaker SDK.
 */
export class ESPRMBase {
  /**
   * Configuration object for the ESPRMBase class.
   */
  static #config: ESPRMBaseConfig | null = null;

  /**
   * Indicates whether logging is enabled.
   */
  static isLoggingEnabled: boolean = false;

  /**
   * Storage adapter for the SDK.
   */
  static ESPStorageAdapter: ESPRMStorageAdapterInterface;

  /**
   * Provisioning adapter for the SDK.
   */
  static ESPProvisionAdapter: ESPProvisionAdapterInterface;

  /**
   * Local discovery adapter for the SDK.
   */
  static ESPLocalDiscoveryAdapter: ESPLocalDiscoveryAdapterInterface;

  /**
   * Local control adapter for the SDK.
   */
  static ESPLocalControlAdapter: ESPLocalControlAdapterInterface;

  /**
   * Notification adapter for the SDK.
   */
  static ESPNotificationAdapter: ESPNotificationAdapterInterface;

  /**
   * Oauth adapter for the SDK.
   */
  static ESPOauthAdapter: ESPOauthAdapterInterface;

  /**
   * Priority queue of transport modes.
   */
  static transportOrder: ESPTransportMode[] = [ESPTransportMode.cloud];

  /**
   * Configures the ESPRMBase instance with the specified configuration.
   * Validates the configuration and initializes necessary services.
   *
   * @param config - The configuration object for the ESPRMBase.
   * @throws {ESPConfigError} If the configuration is invalid.
   */
  public static configure(config: ESPRMBaseConfig): void {
    ConfigValidator.validateConfig(config);
    ESPRMBase.#config = {
      ...config,
      version: config.version || DEFAULT_REST_API_VERSION, // Default version value
    };

    if (config.customStorageAdapter) {
      ESPRMBase.ESPStorageAdapter = config.customStorageAdapter;
    }
    if (config.provisionAdapter) {
      ESPRMBase.ESPProvisionAdapter = config.provisionAdapter;
    }
    if (config.localDiscoveryAdapter) {
      ESPRMBase.ESPLocalDiscoveryAdapter = config.localDiscoveryAdapter;
    }
    if (config.localControlAdapter) {
      ESPRMBase.ESPLocalControlAdapter = config.localControlAdapter;
    }
    if (config.notificationAdapter) {
      ESPRMBase.ESPNotificationAdapter = config.notificationAdapter;
    }
    if (config.oauthAdapter) {
      ESPRMBase.ESPOauthAdapter = config.oauthAdapter;
    }
    const apiManagerConfig: ESPRMAPIManagerConfig = {
      baseUrl: config.baseUrl,
      version: config.version || DEFAULT_REST_API_VERSION,
    };
    ESPRMAPIManager.initialize(apiManagerConfig);
    ESPRMStorage.initialize(ESPRMBase.ESPStorageAdapter);
  }

  /**
   * Retrieves the current configuration of the ESPRMBase.
   *
   * @returns {Readonly<ESPRMBaseConfig>} The current ESPRMBase configuration object.
   */
  public static getConfig(): Readonly<ESPRMBaseConfig> {
    if (!ESPRMBase.#config) {
      throw new ESPConfigError(ConfigErrorCodes.SDK_NOT_CONFIGURED);
    }
    return ESPRMBase.#config;
  }

  /**
   * Retrieves the current version of the package.
   *
   * @returns {string} The version of the package as a string.
   */
  public static currentVersion(): string {
    return packageInfo.version;
  }

  /**
   * Sets the logging status for the ESPRMBase SDK.
   *
   * @param status - A boolean indicating whether to enable (true) or disable (false) logging.
   */
  public static enableLogs(status: boolean): void {
    ESPRMBase.isLoggingEnabled = status;
  }

  /**
   * Creates and retrieves a new instance of the ESPRMAuth class.
   *
   * @returns {ESPRMAuth} An instance of the ESPRMAuth class.
   * @throws {ESPConfigError} If the SDK is not configured.
   */
  public static getAuthInstance(): ESPRMAuth {
    if (!ESPRMBase.#config) {
      throw new ESPConfigError(ConfigErrorCodes.SDK_NOT_CONFIGURED);
    }
    return new ESPRMAuth();
  }

  /**
   * Sets a custom storage adapter for the SDK.
   *
   * @param adapter - The custom storage adapter implementing ESPRMStorageAdapterInterface.
   */
  public static setCustomStorageAdapter(
    adapter: ESPRMStorageAdapterInterface
  ): void {
    ESPRMBase.ESPStorageAdapter = adapter;
  }

  /**
   * Sets the provisioning adapter for the SDK.
   *
   * @param adapter - The provisioning adapter implementing ESPProvisionAdapterInterface.
   */
  public static setProvisioningAdapter(
    adapter: ESPProvisionAdapterInterface
  ): void {
    ESPRMBase.ESPProvisionAdapter = adapter;
  }

  /**
   * Sets the local discovery adapter for the SDK.
   *
   * @param adapter - The local discovery adapter implementing ESPLocalDiscoveryAdapterInterface.
   */
  public static setLocalDiscoveryAdapter(
    adapter: ESPLocalDiscoveryAdapterInterface
  ): void {
    ESPRMBase.ESPLocalDiscoveryAdapter = adapter;
  }

  /**
   * Sets the local control adapter for the SDK.
   *
   * @param adapter - The local control adapter implementing ESPLocalControlAdapterInterface.
   */
  public static setLocalControlAdapter(
    adapter: ESPLocalControlAdapterInterface
  ): void {
    ESPRMBase.ESPLocalControlAdapter = adapter;
  }

  /**
   * Sets the notification adapter for the SDK.
   *
   * @param adapter - The notification adapter implementing ESPNotificationAdapterInterface.
   */
  public static setNotificationAdapter(
    adapter: ESPNotificationAdapterInterface
  ): void {
    ESPRMBase.ESPNotificationAdapter = adapter;
  }

  /**
   * Sets the oauth adapter for the SDK.
   *
   * @param adapter - The oauth adapter implementing ESPOauthAdapterInterface.
   */
  public static setOauthAdapter(adapter: ESPOauthAdapterInterface): void {
    ESPRMBase.ESPOauthAdapter = adapter;
  }

  /**
   * Sets the order of transport modes.
   *
   * This method allows you to specify the preferred order of transport modes (e.g., local, cloud, etc.)
   * that the ESPRMBase instance should use when communicating with nodes devices. The transport modes
   * are tried in the order they are provided until a successful connection is established.
   *
   * @param transportOrder - An array of transport modes in the preferred order.
   *
   * @example
   * ```typescript
   * const transportOrder = [ESPTransportMode.WIFI, ESPTransportMode.BLE];
   * espRMBaseInstance.setTransportOrder(transportOrder);
   * ```
   */
  public static setTransportOrder(transportOrder: ESPTransportMode[]): void {
    for (const transport of transportOrder) {
      if (!isValidEnumValue(transport, ESPTransportMode)) {
        throw new ESPConfigError(ConfigErrorCodes.INVALID_TRANSPORT_MODE);
      }
    }
    ESPRMBase.transportOrder = transportOrder;
  }

  /**
   * Retrieves the MQTT host.
   *
   * @returns A promise that resolves to the MQTT host.
   * @throws {ESPConfigError} If the SDK is not configured.
   */
  public static async getMQTTHost(): Promise<string> {
    // Get base URL from ESPRMBase configuration (without version)
    const config = ESPRMBase.getConfig();
    const baseURL = config.baseUrl;

    const requestConfig = {
      baseURL: baseURL,
      method: HTTPMethods.GET,
      url: APIEndpoints.MQTT_HOST,
    };

    const response = await ESPRMAPIManager.request(requestConfig);
    return response[APIResponseFields.MQTT_HOST];
  }
}
