/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMUser } from "../../ESPRMUser";
import { ESPRMAPIManager } from "../../services/ESPRMAPIManager";
import { UserCustomDataResponse } from "../../types";
import { APIEndpoints, HTTPMethods } from "../../utils/constants";

/**
 * Augments the ESPRMUser class with the `getCustomData` method.
 */
declare module "../../ESPRMUser" {
  interface ESPRMUser {
    /**
     * Fetches custom data associated with the current user.
     * This method sends a request to fetch custom data associated with the currently logged-in user.
     * @returns A promise that resolves with the custom data associated with the user.
     */
    getCustomData(): Promise<UserCustomDataResponse>;
  }
}

ESPRMUser.prototype.getCustomData =
  async function (): Promise<UserCustomDataResponse> {
    const requestConfig = {
      url: APIEndpoints.USER_CUSTOM_DATA,
      method: HTTPMethods.GET,
    };

    return await ESPRMAPIManager.authorizeRequest(requestConfig);
  };
