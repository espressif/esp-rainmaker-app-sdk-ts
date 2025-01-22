/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMUser } from "../../ESPRMUser";

import { GetUserInfoRequest } from "../../types/input";
import { ESPRMUserInfo, GetUserInfoResponse } from "../../types/output";

import { ESPRMAPIManager } from "../../services/ESPRMAPIManager";
import { transformUserInfoResponse } from "../../services/ESPRMHelpers/TransformUserInfoResponse";
import { APIEndpoints, HTTPMethods } from "../../utils/constants";

/**
 * Augments the ESPRMUser class with the `getUserInfo` method.
 */
declare module "../../ESPRMUser" {
  interface ESPRMUser {
    /**
     * Retrieves user information, optionally including custom data.
     *
     * @param withCustomData - Optional flag indicating whether to include custom data in the response. Defaults to `false`.
     * @returns A promise that resolves to an `ESPRMUserInfo` object containing the user information.
     */
    getUserInfo(withCustomData?: boolean): Promise<ESPRMUserInfo>;
  }
}

/**
 * Retrieves user information from the API, with the option to include custom data.
 *
 * @param withCustomData - Optional flag to include custom data in the response. Defaults to `false`.
 * @returns A promise that resolves to an `ESPRMUserInfo` object containing the user information.
 */
ESPRMUser.prototype.getUserInfo = async function (
  withCustomData?: boolean
): Promise<ESPRMUserInfo> {
  const requestData: GetUserInfoRequest = {
    custom_data: withCustomData,
  };

  const requestConfig = {
    url: APIEndpoints.USER,
    method: HTTPMethods.GET,
    params: requestData,
  };

  const response = await ESPRMAPIManager.authorizeRequest(requestConfig);
  const responseData: GetUserInfoResponse = response;
  return transformUserInfoResponse(responseData);
};
