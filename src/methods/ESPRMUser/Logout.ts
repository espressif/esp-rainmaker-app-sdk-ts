/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMUser } from "../../ESPRMUser";
import { ESPRMAPIManager } from "../../services/ESPRMAPIManager";

import { ESPAPIResponse } from "../../types/output";
import { LogoutRequest } from "../../types/input";
import {
  APIEndpoints,
  HTTPMethods,
  StatusMessage,
} from "../../utils/constants";

/**
 * Augments the ESPRMUser class with the `logout` method.
 */
declare module "../../ESPRMUser" {
  interface ESPRMUser {
    /**
     * Logs out the current user, with an option to log out from all sessions.
     *
     * @param shouldLogoutFromAllSessions - Optional flag indicating whether to log out from all sessions. Defaults to `false`.
     * @returns A promise that resolves to an `ESPAPIResponse` object containing the result of the logout operation.
     */
    logout(shouldLogoutFromAllSessions?: boolean): Promise<ESPAPIResponse>;
  }
}

/**
 * Logs out the current user from the application, with an option to log out from all sessions.
 *
 * @param shouldLogoutFromAllSessions - Optional flag indicating whether to log out from all sessions. Defaults to `false`.
 * @returns A promise that resolves to an `ESPAPIResponse` object containing the result of the logout operation.
 */
ESPRMUser.prototype.logout = async function (
  shouldLogoutFromAllSessions?: boolean
): Promise<ESPAPIResponse> {
  try {
    const requestData: LogoutRequest = {
      logout_all: shouldLogoutFromAllSessions,
    };

    const requestConfig = {
      url: APIEndpoints.LOGOUT,
      method: HTTPMethods.POST,
      data: requestData,
    };

    const response = await ESPRMAPIManager.authorizeRequest(requestConfig);
    const responseData: ESPAPIResponse = response;

    if (responseData.status === StatusMessage.SUCCESS) {
      this.cleanUpResources();
    }

    return responseData;
  } catch (error) {
    this.cleanUpResources();
    throw error;
  }
};
