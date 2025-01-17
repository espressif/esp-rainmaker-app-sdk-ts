/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Decodes a JWT token and returns its payload.
 *
 * @param token - The JWT token to decode.
 * @returns The decoded payload of the token.
 * @throws Error if the token is malformed or decoding fails.
 */
const decodeToken = (token: string) => {
  const arrayToken = token.split(".");
  return JSON.parse(atob(arrayToken[1]));
};

export { decodeToken };
