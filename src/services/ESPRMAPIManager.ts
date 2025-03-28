/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { parseAPIErrorResponse } from "../utils/error/parser";
import { ESPRMUser } from "../ESPRMUser";
import { AdditionalInfo, HTTPStatusCodes } from "../utils/constants";
import { hasProperty } from "./ESPRMHelpers/HasProperty";
import { ESPRMAPIManagerConfig, PropertyCheckMode } from "../types/input";
import { ESPAPIError } from "../types/output";
/**
 * Manages API requests and handles configuration, authentication, and error parsing.
 */
export class ESPRMAPIManager {
  /** Singleton instance of ESPRMAPIManager */
  static #instance: ESPRMAPIManager;

  /** Base URL for making HTTP requests */
  #baseUrl: string;

  /**
   * Private constructor to initialize the base URL.
   * @param config - Configuration object for the ESPRMAPIManager.
   */
  private constructor(config: ESPRMAPIManagerConfig) {
    const { baseUrl, version } = config;
    this.#baseUrl = `${baseUrl}/${version}`;
  }

  /**
   * Initializes the singleton instance of ESPRMAPIManager.
   * @param config - Configuration object for the ESPRMAPIManager.
   */
  public static initialize(config: ESPRMAPIManagerConfig) {
    ESPRMAPIManager.#instance = new ESPRMAPIManager(config);
  }

  /**
   * Gets the singleton instance of ESPRMAPIManager.
   *
   * @returns The singleton instance of ESPRMAPIManager.
   */
  static #getInstance(): ESPRMAPIManager {
    return ESPRMAPIManager.#instance;
  }

  /**
   * Adds an authorization token to the request and performs the request.
   *
   * @param requestConfig - The fetch request configuration.
   * @returns A promise that resolves with the result of the request.
   */
  public static async authorizeRequest(requestConfig: any) {
    try {
      const accessToken = await ESPRMUser.getAccessToken();
      const requestConfigWithAuthToken: RequestInit = {
        ...requestConfig,
        headers: {
          ...requestConfig.headers,
          Authorization: `${accessToken}`,
        },
      };
      return await this.request(requestConfigWithAuthToken);
    } catch (error) {
      if (
        hasProperty(
          error as ESPAPIError,
          "statusCode",
          PropertyCheckMode.OwnPropertyOnly
        )
      ) {
        const _error = error as ESPAPIError;
        if (_error.statusCode === HTTPStatusCodes.UNAUTHORIZED) {
          _error.additionalInfo = AdditionalInfo.AUTHENTICATION_REQUIRED;
          ESPRMUser.clearAllTokens();
          throw _error;
        }
      }
      throw error;
    }
  }

  /**
   * Performs the HTTP request using the Fetch API.
   *
   * @param requestConfig - The fetch request configuration.
   * @returns A promise that resolves with the result of the request.
   */
  public static async request(requestConfig: any) {
    const instance = ESPRMAPIManager.#getInstance();
    let requestUrl = "";
    if (requestConfig.baseURL) {
      requestUrl = `${requestConfig.baseURL}/${requestConfig.url}`;
    } else {
      requestUrl = `${instance.#baseUrl}/${requestConfig.url}`;
    }

    if (requestConfig.params) {
      const queryParams = new URLSearchParams(requestConfig.params).toString();
      requestUrl += `?${queryParams}`;
    }

    const fetchOptions = {
      ...requestConfig,
      method: requestConfig.method,
      headers: {
        ...requestConfig.headers,
      },
    };

    if (requestConfig.data) {
      fetchOptions.body = JSON.stringify(requestConfig.data);
    }

    const response = await fetch(requestUrl, fetchOptions);

    if (!response.ok) {
      const errorResponse = await response.json();
      throw parseAPIErrorResponse(errorResponse, response.status);
    }

    return response.json();
  }
}
