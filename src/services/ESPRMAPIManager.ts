/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMBase } from "../ESPRMBase";
import { parseAPIErrorResponse } from "../utils/error/parser";
import { ESPRMUser } from "../ESPRMUser";

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
   */
  private constructor() {
    const { baseUrl, version } = ESPRMBase.getConfig();
    this.#baseUrl = `${baseUrl}/${version}`;
  }

  /**
   * Initializes the singleton instance of ESPRMAPIManager.
   */
  public static initialize() {
    ESPRMAPIManager.#instance = new ESPRMAPIManager();
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
      return this.request(requestConfigWithAuthToken);
    } catch (error) {
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
