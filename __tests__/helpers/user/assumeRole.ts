/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMUser } from "../../../src/ESPRMUser";
import { AssumeRoleRequest, ESPAPIError } from "../../../src/types";
import { apiCallValidationErrorMessages } from "../../../src/utils/error/errorMessages";
import { ESPAPICallValidationError } from "../../../src/utils/error/Error";
import { MOCK_API_ERROR_RESPONSE, MOCK_ASSUME_ROLE_RESPONSE } from "./utils";

// Success test cases

/**
 * Helper function to test assuming role successfully with nodeIds
 * @param user - The user instance
 * @param request - The assume role request
 */
export async function assumeRoleWithNodeIdsSuccessTest(
  user: ESPRMUser,
  request: AssumeRoleRequest
) {
  const result = await user.assumeRole(request);

  expect(result).toHaveProperty("accessKey");
  expect(result).toHaveProperty("secretKey");
  expect(result).toHaveProperty("sessionToken");
  expect(result.accessKey).toBe(MOCK_ASSUME_ROLE_RESPONSE.access_key);
  expect(result.secretKey).toBe(MOCK_ASSUME_ROLE_RESPONSE.secret_key);
  expect(result.sessionToken).toBe(MOCK_ASSUME_ROLE_RESPONSE.session_token);
}

/**
 * Helper function to test assuming role successfully with groupIds
 * @param user - The user instance
 * @param request - The assume role request
 */
export async function assumeRoleWithGroupIdsSuccessTest(
  user: ESPRMUser,
  request: AssumeRoleRequest
) {
  const result = await user.assumeRole(request);

  expect(result).toHaveProperty("accessKey");
  expect(result).toHaveProperty("secretKey");
  expect(result).toHaveProperty("sessionToken");
}

/**
 * Helper function to test assuming role successfully with empty request
 * @param user - The user instance
 * @param request - The assume role request
 */
export async function assumeRoleWithEmptyRequestSuccessTest(
  user: ESPRMUser,
  request: AssumeRoleRequest
) {
  const result = await user.assumeRole(request);

  expect(result).toHaveProperty("accessKey");
  expect(result).toHaveProperty("secretKey");
  expect(result).toHaveProperty("sessionToken");
}

/**
 * Helper function to test assuming role successfully and verify response structure
 * @param user - The user instance
 * @param request - The assume role request
 */
export async function assumeRoleResponseStructureTest(
  user: ESPRMUser,
  request: AssumeRoleRequest
) {
  const result = await user.assumeRole(request);

  expect(result).toHaveProperty("accessKey");
  expect(result).toHaveProperty("secretKey");
  expect(result).toHaveProperty("sessionToken");
  expect(typeof result.accessKey).toBe("string");
  expect(typeof result.secretKey).toBe("string");
  expect(typeof result.sessionToken).toBe("string");
}

// Validation error test cases

/**
 * Helper function to test validation error for exceeding max nodeIds count
 * @param user - The user instance
 * @param request - The assume role request with more than max nodeIds
 */
export async function assumeRoleExceedsMaxNodeIdsTest(
  user: ESPRMUser,
  request: AssumeRoleRequest
) {
  try {
    await user.assumeRole(request);
  } catch (error) {
    expect((error as ESPAPICallValidationError).message).toBe(
      apiCallValidationErrorMessages.INVALID_ASSUME_ROLE_NODE_IDS_COUNT
    );
  }
}

/**
 * Helper function to test validation error for exceeding max groupIds count
 * @param user - The user instance
 * @param request - The assume role request with more than max groupIds
 */
export async function assumeRoleExceedsMaxGroupIdsTest(
  user: ESPRMUser,
  request: AssumeRoleRequest
) {
  try {
    await user.assumeRole(request);
  } catch (error) {
    expect((error as ESPAPICallValidationError).message).toBe(
      apiCallValidationErrorMessages.INVALID_ASSUME_ROLE_GROUP_IDS_COUNT
    );
  }
}

/**
 * Helper function to test validation error for invalid userRole
 * @param user - The user instance
 * @param request - The assume role request with invalid userRole
 */
export async function assumeRoleInvalidUserRoleTest(
  user: ESPRMUser,
  request: AssumeRoleRequest
) {
  try {
    await user.assumeRole(request);
  } catch (error) {
    expect((error as ESPAPICallValidationError).message).toBe(
      apiCallValidationErrorMessages.INVALID_ASSUME_ROLE_USER_ROLE
    );
  }
}

/**
 * Helper function to test validation error when both groupIds and nodeIds are provided
 * @param user - The user instance
 * @param request - The assume role request with both groupIds and nodeIds
 */
export async function assumeRoleBothGroupIdsAndNodeIdsTest(
  user: ESPRMUser,
  request: AssumeRoleRequest
) {
  try {
    await user.assumeRole(request);
  } catch (error) {
    expect((error as ESPAPICallValidationError).message).toBe(
      apiCallValidationErrorMessages.INVALID_ASSUME_ROLE_PARAMS
    );
  }
}

/**
 * Helper function to test validation error when videostream role is used without nodeIds
 * @param user - The user instance
 * @param request - The assume role request with videostream role but no nodeIds
 */
export async function assumeRoleVideostreamWithoutNodeIdsTest(
  user: ESPRMUser,
  request: AssumeRoleRequest
) {
  await expect(user.assumeRole(request)).rejects.toThrow(
    ESPAPICallValidationError
  );

  try {
    await user.assumeRole(request);
  } catch (error) {
    expect((error as ESPAPICallValidationError).message).toBe(
      apiCallValidationErrorMessages.MISSING_ASSUME_ROLE_NODE_IDS_FOR_VIDEOSTREAM
    );
  }
}

// API error test cases

/**
 * Helper function to test API error handling
 * @param user - The user instance
 * @param request - The assume role request
 */
export async function assumeRoleAPIErrorTest(
  user: ESPRMUser,
  request: AssumeRoleRequest
) {
  try {
    await user.assumeRole(request);
  } catch (error) {
    expect((error as ESPAPIError).description).toBe(
      MOCK_API_ERROR_RESPONSE.description
    );
  }
}
