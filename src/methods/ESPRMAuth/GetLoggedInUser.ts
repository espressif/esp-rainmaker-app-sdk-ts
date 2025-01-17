/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMAuth } from "../../ESPRMAuth";
import { ESPRMUser } from "../../ESPRMUser";

import { UserTokensData } from "../../types/input";

import { ESPRMStorage } from "../../services/ESPRMStorage/ESPRMStorage";
import { isTokenExpired } from "../../services/ESPRMHelpers/CheckTokenExpiry";
import { StorageKeys } from "../../utils/constants";

/**
 * Augments the ESPRMAuth class with the `getLoggedInUser` method.
 */
declare module "../../ESPRMAuth" {
  interface ESPRMAuth {
    /**
     * Retrieves the currently logged-in user.
     *
     * This method checks if the access token is available and valid. If the access token is expired,
     * it attempts to refresh the session using the refresh token. If successful, it returns an instance
     * of the ESPRMUser class containing the user's tokens. If no valid access token is found, it returns null.
     *
     * @returns {Promise<ESPRMUser | null>} A promise that resolves to an instance of ESPRMUser if the user is logged in, or null if not.
     */
    getLoggedInUser(): Promise<ESPRMUser | null>;
  }
}

ESPRMAuth.prototype.getLoggedInUser =
  async function (): Promise<ESPRMUser | null> {
    let accessToken = await ESPRMStorage.getItem(StorageKeys.ACCESSTOKEN);
    let idToken = (await ESPRMStorage.getItem(StorageKeys.IDTOKEN))!;
    let refreshToken = (await ESPRMStorage.getItem(StorageKeys.REFRESHTOKEN))!;
    let userTokens = undefined;
    if (accessToken) {
      if (isTokenExpired(accessToken)) {
        await ESPRMUser.extendSession(refreshToken);
        accessToken = (await ESPRMStorage.getItem(StorageKeys.ACCESSTOKEN))!;
        idToken = (await ESPRMStorage.getItem(StorageKeys.IDTOKEN))!;
      }
      userTokens = {
        accessToken,
        idToken,
        refreshToken,
      } as UserTokensData;
      const userInstance = new ESPRMUser(userTokens);
      return userInstance;
    }
    return null;
  };
