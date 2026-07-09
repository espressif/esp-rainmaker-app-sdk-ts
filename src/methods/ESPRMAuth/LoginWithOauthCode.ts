/*
 * SPDX-FileCopyrightText: 2026 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMAuth } from "../../ESPRMAuth";
import { ESPRMBase } from "../../ESPRMBase";
import { ESPRMUser } from "../../ESPRMUser";
import { ESPRMAPIManager } from "../../services/ESPRMAPIManager";

import {
  ESPIdProvider,
  LoginWithOauthCodeOptions,
  UserTokensData,
} from "../../types/input";
import { LoginWithOauthCodeResponse } from "../../types/output";
import {
  APICallValidationErrorCodes,
  APIEndpoints,
  APIRequestFields,
  HTTPMethods,
} from "../../utils/constants";
import { ESPAPICallValidationError } from "../../utils/error/ESPAPICallValidationError";
import { isNonEmptyString } from "../../utils/export";

/**
 * Augments the ESPRMAuth class with the `loginWithOauthCode` method.
 */
declare module "../../ESPRMAuth" {
  interface ESPRMAuth {
    /**
     * Exchanges a previously obtained OAuth authorization code for user tokens.
     *
     * Unlike {@link ESPRMAuth.loginWithOauth}, this method does not request the
     * code itself. The caller supplies an authorization code that was already
     * acquired out-of-band — for example, from the WeChat native SDK in the CN
     * region — and this method performs only the token-exchange step, returning
     * an authenticated `ESPRMUser`.
     *
     * @param code - The OAuth authorization code to exchange for tokens.
     * @param options - Optional flags controlling the exchange. Set
     *   `wechatTokenOnly` to add the `wechat_token_only=true` flag required by
     *   the WeChat token exchange; it also sends the WeChat
     *   `identity_provider` by default, which `identityProvider` overrides.
     * @returns A promise that resolves to an instance of `ESPRMUser` containing
     *   the access, ID, and refresh tokens.
     * @throws ESPAPICallValidationError if the code or the required SDK config
     *   (auth URL, client ID) is missing.
     */
    loginWithOauthCode(
      code: string,
      options?: LoginWithOauthCodeOptions
    ): Promise<ESPRMUser>;
  }
}

/**
 * Exchanges an OAuth authorization code for access, ID, and refresh tokens.
 *
 * The token-exchange parameters (token endpoint, client id, redirect uri) are
 * read from the active, region-aware SDK config, so for the CN region this
 * targets the China RainMaker cloud automatically. Parameters are sent in the
 * `application/x-www-form-urlencoded` request body, per the OAuth 2.0 token
 * endpoint spec (RFC 6749 §4.1.3); `loginWithOauth` shares this same exchange.
 *
 * @param code - The OAuth authorization code to exchange.
 * @param options - Optional exchange flags. `wechatTokenOnly` adds the
 *   `wechat_token_only=true` flag required by the WeChat token exchange and
 *   sends the WeChat `identity_provider` by default; `identityProvider`
 *   overrides the provider name sent.
 * @returns A promise resolving to an `ESPRMUser` instance containing the
 *   access, ID, and refresh tokens.
 * @throws ESPAPICallValidationError if the code or required config is missing.
 */
ESPRMAuth.prototype.loginWithOauthCode = async function (
  code: string,
  options: LoginWithOauthCodeOptions = {}
): Promise<ESPRMUser> {
  const { authUrl, redirectUrl, clientId } = ESPRMBase.getConfig();

  // Validate required parameters
  if (!isNonEmptyString(code)) {
    throw new ESPAPICallValidationError(
      APICallValidationErrorCodes.MISSING_OAUTH_CODE
    );
  }
  if (!isNonEmptyString(authUrl)) {
    throw new ESPAPICallValidationError(
      APICallValidationErrorCodes.MISSING_AUTH_URL
    );
  }
  if (!isNonEmptyString(clientId)) {
    throw new ESPAPICallValidationError(
      APICallValidationErrorCodes.MISSING_CLIENT_ID
    );
  }

  // Build the token-exchange body. Per the OAuth 2.0 token endpoint spec
  // (RFC 6749 §4.1.3) the parameters are sent as an x-www-form-urlencoded
  // string; we encode it here and pass the ready-to-send body to
  // ESPRMAPIManager, which transmits string `data` verbatim.
  const tokenRequestParams = new URLSearchParams();
  tokenRequestParams.append(
    APIRequestFields.GRANT_TYPE_KEY,
    APIRequestFields.OAUTH_CODE_GRANT_TYPE
  );
  tokenRequestParams.append(APIRequestFields.CLIENT_ID_KEY, clientId as string);
  tokenRequestParams.append(APIRequestFields.OAUTH_CODE_KEY, code);

  // redirect_uri is sent whenever configured: the browser OAuth flow echoes it
  // back (RFC 6749 §4.1.3), and the RainMaker CN WeChat token exchange also
  // requires it (omitting it returns `invalid_request`).
  if (isNonEmptyString(redirectUrl)) {
    tokenRequestParams.append(
      APIRequestFields.REDIRECT_URI_KEY,
      redirectUrl as string
    );
  }

  // WeChat (CN region) requires the token-only exchange flag.
  if (options.wechatTokenOnly) {
    tokenRequestParams.append(
      APIRequestFields.WECHAT_TOKEN_ONLY_KEY,
      APIRequestFields.WECHAT_TOKEN_ONLY_VALUE
    );
  }

  // identity_provider tells the token endpoint which IdP issued the code. The
  // WeChat exchange defaults to the WeChat provider; pass
  // `options.identityProvider` to override the provider name.
  const identityProvider =
    options.identityProvider ??
    (options.wechatTokenOnly ? ESPIdProvider.WECHAT : undefined);
  if (isNonEmptyString(identityProvider)) {
    tokenRequestParams.append(
      APIRequestFields.IDENTITY_PROVIDER_KEY,
      identityProvider as string
    );
  }

  const requestConfig = {
    baseURL: authUrl,
    url: APIEndpoints.TOKEN,
    method: HTTPMethods.POST,
    data: tokenRequestParams.toString(),
    headers: {
      [APIRequestFields.CONTENT_TYPE_KEY]:
        APIRequestFields.URL_ENCODED_CONTENT_TYPE,
    },
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
