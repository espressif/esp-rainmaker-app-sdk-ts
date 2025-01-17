/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMAuth } from "../../ESPRMAuth";
import { ESPRMUser } from "../../ESPRMUser";
import { ESPRMAPIManager } from "../../services/ESPRMAPIManager";

import { SignUpRequest, UserTokensData } from "../../types/input";
import { LoginWithPasswordResponse } from "../../types/output";

import { ESPValidationError } from "../../utils/error/Error";
import {
  APIEndpoints,
  HTTPMethods,
  ValidationErrorCodes,
} from "../../utils/constants";

/**
 * Augments the ESPRMAuth class with the `login` method.
 */
declare module "../../ESPRMAuth" {
  interface ESPRMAuth {
    /**
     * Logs in a user by their username and password, returning an `ESPRMUser` instance upon success.
     *
     * @param username - The username of the user logging in.
     * @param password - The password of the user.
     * @returns A promise that resolves to an instance of `ESPRMUser` containing the user's tokens.
     * @throws ESPValidationError if the password is missing.
     */
    login(username: string, password: string): Promise<ESPRMUser>;
  }
}

/**
 * Logs in a user by sending their username and password to the API.
 * If the login is successful, an `ESPRMUser` instance is created with the returned tokens.
 *
 * @param username - The username of the user.
 * @param password - The password of the user.
 * @returns A promise resolving to an `ESPRMUser` instance containing the access, ID, and refresh tokens.
 * @throws ESPValidationError if the password is missing.
 */
ESPRMAuth.prototype.login = async function (
  username: string,
  password: string
): Promise<ESPRMUser> {
  if (!password) {
    throw new ESPValidationError(ValidationErrorCodes.MISSING_LOGIN_PASSWORD);
  }

  const requestData: SignUpRequest = {
    user_name: username,
    password,
  };

  const requestConfig = {
    url: APIEndpoints.LOGIN,
    method: HTTPMethods.POST,
    data: requestData,
  };

  const response = await ESPRMAPIManager.request(requestConfig);
  const responseData: LoginWithPasswordResponse = response;

  const userTokens: UserTokensData = {
    accessToken: responseData.accesstoken,
    idToken: responseData.idtoken,
    refreshToken: responseData.refreshtoken,
  };

  const userInstance = new ESPRMUser(userTokens);
  return userInstance;
};
