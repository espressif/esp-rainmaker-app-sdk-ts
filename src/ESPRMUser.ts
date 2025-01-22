/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMAPIManager } from "./services/ESPRMAPIManager";
import { ESPRMStorage } from "./services/ESPRMStorage/ESPRMStorage";
import { isTokenExpired } from "./services/ESPRMHelpers/CheckTokenExpiry";

import { ExtendSessionResponse } from "./types/output";
import { EventCallbacks, UserTokensData } from "./types/input";
import {
  APIEndpoints,
  HTTPMethods,
  StorageKeys,
  TokenErrorCodes,
} from "./utils/constants";
import { ESPTokenError } from "./utils/error/Error";
import { decodeToken } from "./services/ESPRMHelpers/DecodeToken";

/**
 * The `ESPRMUser` class serves as the central interface for managing user-related operations
 * within the ESP RainMaker SDK. It provides a comprehensive set of methods for:
 *
 * - **Account Management**: Retrieve user information, request and confirm account deletion, update user details, and configure Multi-Factor Authentication (MFA).
 * - **Group Management**: Create, retrieve, share, and transfer groups, as well as manage group sharing requests.
 * - **Node Management**: Fetch user nodes, get node details, manage node mappings, and handle node sharing requests.
 * - **Notification Management**: Create platform endpoints for push notifications and manage endpoints.
 * - **Event Handling**: Subscribe to and manage user-specific events.
 *
 * By utilizing the `ESPRMUser` class, developers can seamlessly manage user sessions, interact with
 * backend APIs, and handle complex user-related workflows.
 */
export class ESPRMUser {
  /**
   * User ID of the current user.
   */
  static userId: string;

  /**
   * Event callbacks for user-specific events.
   */
  eventCallbacks: EventCallbacks = {};

  /**
   * Initializes the ESPRMUser instance and stores tokens in local storage.
   *
   * @param tokens - Object containing the access token, id token, and refresh token.
   */
  constructor(tokens: UserTokensData) {
    ESPRMStorage.setItem(StorageKeys.ACCESSTOKEN, tokens.accessToken);
    ESPRMStorage.setItem(StorageKeys.IDTOKEN, tokens.idToken);
    ESPRMStorage.setItem(StorageKeys.REFRESHTOKEN, tokens.refreshToken);

    ESPRMUser.userId = decodeToken(tokens.idToken)["custom:user_id"];
  }

  /**
   * Retrieves the current access token. If the access token is expired, it attempts to extend the session using the refresh token.
   *
   * @returns A promise that resolves to the access token or an empty string if no valid token is available.
   */
  public static async getAccessToken(): Promise<string> {
    const accessToken = await ESPRMStorage.getItem(StorageKeys.ACCESSTOKEN);
    if (accessToken) {
      if (!isTokenExpired(accessToken)) {
        return accessToken;
      }
      const refreshToken = await ESPRMStorage.getItem(StorageKeys.REFRESHTOKEN);
      if (refreshToken) {
        try {
          return await ESPRMUser.extendSession(refreshToken);
        } catch (error) {
          throw new ESPTokenError(TokenErrorCodes.EXTEND_SESSION_FAILED);
        }
      } else {
        throw new ESPTokenError(TokenErrorCodes.MISSING_REFRESH_TOKEN);
      }
    } else {
      throw new ESPTokenError(TokenErrorCodes.MISSING_ACCESS_TOKEN);
    }
  }

  /**
   * Extends the session by exchanging the refresh token for a new access token and id token.
   *
   * @param refreshToken - The refresh token used to extend the session.
   * @returns A promise that resolves to the new access token.
   * @throws Error if session extension fails.
   */
  public static async extendSession(refreshToken: string): Promise<string> {
    const requestData = {
      refreshtoken: refreshToken,
    };

    const requestConfig = {
      url: APIEndpoints.LOGIN,
      method: HTTPMethods.POST,
      data: requestData,
    };

    try {
      const response = await ESPRMAPIManager.request(requestConfig);
      const responseData: ExtendSessionResponse = response;

      ESPRMStorage.setItem(StorageKeys.ACCESSTOKEN, responseData.accesstoken);
      ESPRMStorage.setItem(StorageKeys.IDTOKEN, responseData.idtoken);

      return responseData.accesstoken;
    } catch (error) {
      ESPRMUser.clearAllTokens();
      throw error;
    }
  }

  /**
   * Clears all tokens from memory and local storage.
   */
  public static clearAllTokens(): void {
    ESPRMStorage.removeItem(StorageKeys.ACCESSTOKEN);
    ESPRMStorage.removeItem(StorageKeys.IDTOKEN);
    ESPRMStorage.removeItem(StorageKeys.REFRESHTOKEN);
  }
}
