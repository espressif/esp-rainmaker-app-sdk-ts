/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMUserInfo, GetUserInfoResponse } from "../../types/output";

/**
 * Transforms the raw user info response from the API into a structured format.
 *
 * @param data - The raw user info response from the API.
 * @returns The transformed user info with specific fields mapped.
 */
const transformUserInfoResponse = (
  data: GetUserInfoResponse
): ESPRMUserInfo => {
  const transformedUserInfo: ESPRMUserInfo = {
    userId: data.user_id,
    username: data.user_name,
    mfa: data.mfa,
  };

  if (data.super_admin !== undefined) {
    transformedUserInfo.superAdmin = data.super_admin;
  }
  if (data.picture_url) {
    transformedUserInfo.pictureUrl = data.picture_url;
  }
  if (data.name) {
    transformedUserInfo.name = data.name;
  }
  if (data.phone_number) {
    transformedUserInfo.phoneNumber = data.phone_number;
  }
  if (data.custom_data) {
    transformedUserInfo.customData = data.custom_data;
  }
  if (data.tags) {
    transformedUserInfo.tags = data.tags;
  }

  return transformedUserInfo;
};

export { transformUserInfoResponse };
