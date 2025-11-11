/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Mock assume role API response
 */
export const MOCK_ASSUME_ROLE_RESPONSE = {
  access_key: "ACCESS_KEY",
  secret_key: "SECRET_KEY",
  session_token: "SESSION_TOKEN",
};

/**
 * Mock API error response
 */
export const MOCK_API_ERROR_RESPONSE = {
  status: "failure",
  statusCode: 400,
  errorCode: "FAILED_TO_ASSUME_ROLE",
  description: "Failed to assume role",
};
