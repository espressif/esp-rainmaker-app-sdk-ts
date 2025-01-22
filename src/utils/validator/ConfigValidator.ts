/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { isValidUrl, isNonEmptyString, isValidObject } from "./validators";
import { ESPRMBaseConfig } from "../../types/input";
import { ESPConfigError } from "../error/Error";
import { ConfigErrorCodes } from "../constants";

/**
 * A class that validates configuration objects for authentication.
 *
 * This class provides methods to ensure that the provided configuration
 * adheres to the required structure and rules for URLs and other fields.
 */
export class ConfigValidator {
  /**
   * Validates the given authentication configuration.
   *
   * @param config - The authentication configuration object to validate.
   * @throws {ESPConfigError} If the configuration is invalid.
   */
  static validateConfig(config: ESPRMBaseConfig): void {
    ConfigValidator.validateConfigObject(config);
    ConfigValidator.validateBaseUrl(config.baseUrl);
    ConfigValidator.validateAuthUrl(config.authUrl);
    ConfigValidator.validateRedirectUrl(config.redirectUrl, config.authUrl);
    ConfigValidator.validateClientId(config.clientId, config.authUrl);
  }

  /**
   * Validates that the provided configuration object is valid.
   *
   * @param config - The configuration object to validate.
   * @throws {ESPConfigError} If the configuration object is invalid.
   */
  private static validateConfigObject(config: ESPRMBaseConfig): void {
    if (!isValidObject(config)) {
      throw new ESPConfigError(ConfigErrorCodes.INVALID_CONFIG_OBJECT);
    }
  }

  /**
   * Validates the base URL of the configuration.
   *
   * @param baseUrl - The base URL to validate.
   * @throws {ESPConfigError} If the base URL is invalid or empty.
   */
  private static validateBaseUrl(baseUrl: string): void {
    if (!isNonEmptyString(baseUrl) || !isValidUrl(baseUrl)) {
      throw new ESPConfigError(ConfigErrorCodes.INVALID_BASE_URL);
    }
  }

  /**
   * Validates the authentication URL of the configuration.
   *
   * @param authUrl - The authentication URL to validate. Optional.
   * @throws {ESPConfigError} If the authentication URL is invalid or empty.
   */
  private static validateAuthUrl(authUrl?: string): void {
    if (
      authUrl !== undefined &&
      (!isNonEmptyString(authUrl) || !isValidUrl(authUrl))
    ) {
      throw new ESPConfigError(ConfigErrorCodes.INVALID_AUTH_URL);
    }
  }

  /**
   * Validates the redirect URL based on the authentication URL.
   *
   * @param redirectUrl - The redirect URL to validate. Optional.
   * @param authUrl - The authentication URL. Optional.
   * @throws {ESPConfigError} If the redirect URL is required but not provided, or if it is invalid.
   */
  private static validateRedirectUrl(
    redirectUrl?: string,
    authUrl?: string
  ): void {
    if (authUrl !== undefined) {
      if (redirectUrl === undefined) {
        throw new ESPConfigError(ConfigErrorCodes.REDIRECT_URL_REQUIRED);
      }
      if (!isNonEmptyString(redirectUrl) || !isValidUrl(redirectUrl)) {
        throw new ESPConfigError(ConfigErrorCodes.INVALID_REDIRECT_URL);
      }
    }
  }

  /**
   * Validates the client ID based on the authentication URL.
   *
   * @param clientId - The client ID to validate. Optional.
   * @param authUrl - The authentication URL. Optional.
   * @throws {ESPConfigError} If the client ID is required but not provided.
   */
  private static validateClientId(clientId?: string, authUrl?: string): void {
    if (authUrl !== undefined) {
      if (!isNonEmptyString(clientId)) {
        throw new ESPConfigError(ConfigErrorCodes.CLIENT_ID_REQUIRED);
      }
    }
  }
}
