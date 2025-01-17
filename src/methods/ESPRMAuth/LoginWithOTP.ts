/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMAuth } from "../../ESPRMAuth";
import { ESPRMUser } from "../../ESPRMUser";
import { ESPRMAPIManager } from "../../services/ESPRMAPIManager";

import { LoginWithOTPRequest, UserTokensData } from "../../types/input";
import { LoginWithOTPResponse } from "../../types/output";

import { ESPValidationError } from "../../utils/error/Error";
import {
  APIEndpoints,
  HTTPMethods,
  ValidationErrorCodes,
} from "../../utils/constants";

/**
 * Augments the ESPRMAuth class with the `loginWithOTP` method.
 */
declare module "../../ESPRMAuth" {
  interface ESPRMAuth {
    /**
     * Logs in a user using an OTP (One-Time Password) and a session token.
     *
     * @param username - The username of the user attempting to log in.
     * @param verificationCode - The OTP received by the user.
     * @param sessionToken - The session token associated with the OTP request.
     * @returns A promise that resolves to an instance of `ESPRMUser` containing user tokens.
     * @throws ESPValidationError if the verification code or session token is missing.
     */
    loginWithOTP(
      username: string,
      verificationCode: string,
      sessionToken: string
    ): Promise<ESPRMUser>;
  }
}

/**
 * Logs in a user by sending their username, OTP, and session token to the API.
 * If successful, an `ESPRMUser` instance is created with the returned tokens.
 *
 * @param username - The username of the user.
 * @param verificationCode - The OTP received by the user.
 * @param sessionToken - The session token associated with the OTP request.
 * @returns A promise resolving to an `ESPRMUser` instance containing the access, ID, and refresh tokens.
 * @throws ESPValidationError if the verification code or session token is not provided.
 */
ESPRMAuth.prototype.loginWithOTP = async function (
  username: string,
  verificationCode: string,
  sessionToken: string
): Promise<ESPRMUser> {
  if (!verificationCode) {
    throw new ESPValidationError(
      ValidationErrorCodes.MISSING_LOGIN_REQUEST_VERIFICATION_CODE
    );
  }
  if (!sessionToken) {
    throw new ESPValidationError(
      ValidationErrorCodes.MISSING_LOGIN_REQUEST_SESSION_TOKEN
    );
  }

  const requestData: LoginWithOTPRequest = {
    user_name: username,
    verification_code: verificationCode,
    session: sessionToken,
  };

  const requestConfig = {
    url: APIEndpoints.LOGIN,
    method: HTTPMethods.POST,
    data: requestData,
  };

  const response = await ESPRMAPIManager.request(requestConfig);
  const responseData: LoginWithOTPResponse = response;

  const userTokens: UserTokensData = {
    accessToken: responseData.accesstoken,
    idToken: responseData.idtoken,
    refreshToken: responseData.refreshtoken,
  };

  const userInstance = new ESPRMUser(userTokens);
  return userInstance;
};
