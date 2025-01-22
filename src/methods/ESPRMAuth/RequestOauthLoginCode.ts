/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMAuth } from "../../ESPRMAuth";
import { ESPRMBase } from "../../ESPRMBase";
import { APIEndpoints } from "../../utils/constants";

/**
 * Augments the ESPRMAuth class with the `requestOauthLoginCode` method.
 */
declare module "../../ESPRMAuth" {
  interface ESPRMAuth {
    /**
     * Initiates the OAuth login flow by opening a new window with the authorization URL.
     *
     * @param identityProvider - The identity provider for which to request an OAuth login code.
     * @returns void
     */
    requestOauthLoginCode(identityProvider: string): void;
  }
}

/**
 * Opens a new window to initiate the OAuth login flow for the specified identity provider.
 * Constructs the authorization URL with the appropriate parameters and redirects the user
 * to the identity provider's login page.
 *
 * @param identityProvider - The identity provider to use for OAuth login.
 * @returns void
 */
ESPRMAuth.prototype.requestOauthLoginCode = function (
  identityProvider: string
) {
  const { authUrl, redirectUrl, clientId } = ESPRMBase.getConfig();

  const baseURL = `${authUrl}/${APIEndpoints.AUTHORIZE}`;

  const requestParams = new URLSearchParams();
  requestParams.append("identity_provider", identityProvider);
  requestParams.append("redirect_uri", redirectUrl as string);
  requestParams.append("client_id", clientId as string);
  requestParams.append("response_type", "code");

  const requestURL = `${baseURL}?${requestParams.toString()}`;

  window.open(requestURL);
};
