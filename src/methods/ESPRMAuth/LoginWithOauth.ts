/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMAuth } from "../../ESPRMAuth";
import { ESPRMBase } from "../../ESPRMBase";
import { ESPRMUser } from "../../ESPRMUser";
import { ESPRMAPIManager } from "../../services/ESPRMAPIManager";

import { UserTokensData, ESPIdProvider } from "../../types/input";
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
 * Augments the ESPRMAuth class with the `loginWithOauth` method.
 */
declare module "../../ESPRMAuth" {
  interface ESPRMAuth {
    /**
     * Logs in a user using OAuth by first requesting an OAuth code and then exchanging it for tokens.
     * This method combines the functionality of requesting OAuth code and logging in with the code.
     *
     * @param identityProvider - The identity provider for which to request an OAuth login code.
     * @returns A promise that resolves to an instance of `ESPRMUser` containing user tokens.
     */
    loginWithOauth(
      identityProvider: ESPIdProvider | string
    ): Promise<ESPRMUser>;
  }
}

/**
 * Logs in a user using OAuth by first requesting an OAuth authorization code
 * and then exchanging it for access, ID, and refresh tokens.
 *
 * This method combines two operations:
 * 1. Opens a new window to initiate the OAuth code request for the specified identity provider
 * 2. Exchanges the received OAuth code for user tokens
 *
 * @param identityProvider - The identity provider to use for OAuth login.
 * @returns A promise resolving to an `ESPRMUser` instance containing the access, ID, and refresh tokens.
 */
ESPRMAuth.prototype.loginWithOauth = async function (
  identityProvider: ESPIdProvider | string
): Promise<ESPRMUser> {
  // Validate OAuth adapter availability
  if (!ESPRMBase.ESPOauthAdapter) {
    throw new ESPAPICallValidationError(
      APICallValidationErrorCodes.MISSING_OAUTH_ADAPTER
    );
  }

  const { authUrl, redirectUrl, clientId } = ESPRMBase.getConfig();

  // Validate required parameters
  if (!isNonEmptyString(identityProvider)) {
    throw new ESPAPICallValidationError(
      APICallValidationErrorCodes.MISSING_IDENTITY_PROVIDER
    );
  }
  if (!isNonEmptyString(authUrl)) {
    throw new ESPAPICallValidationError(
      APICallValidationErrorCodes.MISSING_AUTH_URL
    );
  }
  if (!isNonEmptyString(redirectUrl)) {
    throw new ESPAPICallValidationError(
      APICallValidationErrorCodes.MISSING_REDIRECT_URL
    );
  }
  if (!isNonEmptyString(clientId)) {
    throw new ESPAPICallValidationError(
      APICallValidationErrorCodes.MISSING_CLIENT_ID
    );
  }

  // Step 1: Request OAuth code
  const baseURL = `${authUrl}/${APIEndpoints.AUTHORIZE}`;

  const requestParams = new URLSearchParams();
  requestParams.append(
    APIRequestFields.IDENTITY_PROVIDER_KEY,
    identityProvider
  );
  requestParams.append(
    APIRequestFields.REDIRECT_URI_KEY,
    redirectUrl as string
  );
  requestParams.append(APIRequestFields.CLIENT_ID_KEY, clientId as string);
  requestParams.append(
    APIRequestFields.RESPONSE_TYPE_KEY,
    APIRequestFields.OAUTH_CODE_RESPONSE_TYPE
  );

  const requestURL = `${baseURL}?${requestParams.toString()}`;

  // Get OAuth code from adapter
  const code = await ESPRMBase.ESPOauthAdapter.getOauthCode(requestURL);

  // Step 2: Exchange OAuth code for tokens
  const tokenRequestParams = {
    [APIRequestFields.GRANT_TYPE_KEY]: APIRequestFields.OAUTH_CODE_GRANT_TYPE,
    [APIRequestFields.REDIRECT_URI_KEY]: redirectUrl as string,
    [APIRequestFields.CLIENT_ID_KEY]: clientId as string,
    code,
  };

  const requestConfig = {
    baseURL: authUrl,
    url: APIEndpoints.TOKEN,
    method: HTTPMethods.POST,
    params: tokenRequestParams,
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
