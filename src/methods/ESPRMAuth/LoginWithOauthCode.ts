/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMAuth } from "../../ESPRMAuth";
import { ESPRMBase } from "../../ESPRMBase";
import { ESPRMUser } from "../../ESPRMUser";
import { ESPRMAPIManager } from "../../services/ESPRMAPIManager";

import { UserTokensData } from "../../types/input";
import { LoginWithOauthCodeResponse } from "../../types/output";
import { APIEndpoints, HTTPMethods } from "../../utils/constants";

/**
 * Augments the ESPRMAuth class with the `loginWithOauthCode` method.
 */
declare module "../../ESPRMAuth" {
  interface ESPRMAuth {
    /**
     * Logs in a user using an OAuth authorization code.
     *
     * @param code - The OAuth authorization code received after user authorization.
     * @returns A promise that resolves to an instance of `ESPRMUser` containing user tokens.
     */
    loginWithOauthCode(code: string): Promise<ESPRMUser>;
  }
}

/**
 * Logs in a user by exchanging an OAuth authorization code for access, ID, and refresh tokens.
 *
 * @param code - The authorization code received after the user authorizes the app.
 * @returns A promise resolving to an `ESPRMUser` instance containing the access, ID, and refresh tokens.
 */
ESPRMAuth.prototype.loginWithOauthCode = async function (
  code: string
): Promise<ESPRMUser> {
  const { authUrl, redirectUrl, clientId } = ESPRMBase.getConfig();

  const requestData = {
    grant_type: "authorization_code",
    code,
    redirect_uri: redirectUrl,
    client_id: clientId,
  };

  const requestConfig = {
    baseURL: authUrl,
    url: APIEndpoints.TOKEN,
    method: HTTPMethods.POST,
    data: requestData,
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  };

  const response = await ESPRMAPIManager.request(requestConfig);
  const responseData: LoginWithOauthCodeResponse = response;

  const userTokens: UserTokensData = {
    accessToken: responseData.access_token,
    idToken: responseData.id_token,
    refreshToken: responseData.refresh_token,
  };

  const userInstance = new ESPRMUser(userTokens);
  return userInstance;
};
