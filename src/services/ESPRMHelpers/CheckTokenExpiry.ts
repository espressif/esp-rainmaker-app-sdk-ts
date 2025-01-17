/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { decodeToken } from "./DecodeToken";
import { getCurrentTimestamp } from "./GetCurrentTimestamp";

/**
 * Checks if the given token has expired.
 *
 * @param token - The token to check.
 * @returns True if the token has expired, false otherwise.
 */
const isTokenExpired = (token: string): boolean => {
  const tokenPayload = decodeToken(token);
  const tokenExpiryTimestamp = tokenPayload.exp;
  const currentTimestamp = getCurrentTimestamp();
  return currentTimestamp >= tokenExpiryTimestamp;
};

export { isTokenExpired };
