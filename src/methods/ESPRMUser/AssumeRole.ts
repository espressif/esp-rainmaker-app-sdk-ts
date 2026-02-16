/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMUser } from "../../ESPRMUser";
import { ESPRMAPIManager } from "../../services/ESPRMAPIManager";
import { isValidEnumValue } from "../../services/ESPRMHelpers/IsValidEnumValue";
import { AssumeRoleRequest, ESPUserRole } from "../../types/input";
import { AssumeRoleResponse } from "../../types/output";
import {
  APIEndpoints,
  HTTPMethods,
  APICallValidationErrorCodes,
} from "../../utils/constants";
import { ESPAPICallValidationError } from "../../utils/error/Error";
import {
  validateAssumeRoleNodeIdsCount,
  validateAssumeRoleGroupIdsCount,
} from "../../utils/validator/validators";

/**
 * Augments the ESPRMUser class with the `assumeRole` method.
 */
declare module "../../ESPRMUser" {
  interface ESPRMUser {
    /**
     * Assumes a user role and gets temporary security credentials for MQTT and other AWS services.
     *
     * @param request - The assume role request containing optional userRole, groupIds, and/or nodeIds.
     *
     * @remarks
     * - `userRole` is optional. If not provided or empty, it defaults to "mqtt". Only "mqtt" and "videostream" are supported.
     * - `videostream` requires `nodeIds` to generate credentials.
     * - `mqtt` works with `groupIds` and `nodeIds`.
     * - `groupIds` and `nodeIds` are both optional arrays (max {@link AssumeRoleConstants.MAX_NODE_IDS} nodeIds and max {@link AssumeRoleConstants.MAX_GROUP_IDS} groupIds). Only one of them can be non-empty in a request.
     * - If both `groupIds` and `nodeIds` are empty or omitted, credentials will be granted for all groups the user has access to.
     *
     * @returns A promise that resolves to an AssumeRoleResponse containing access credentials (accessKey, secretKey, sessionToken).
     *
     * @throws {ESPAPICallValidationError} If validation fails:
     * - More than {@link AssumeRoleConstants.MAX_NODE_IDS} nodeIds or {@link AssumeRoleConstants.MAX_GROUP_IDS} groupIds are provided
     * - Invalid userRole (not "mqtt" or "videostream")
     * - Both groupIds and nodeIds are provided
     * - videostream role is used without nodeIds
     */
    assumeRole(request: AssumeRoleRequest): Promise<AssumeRoleResponse>;
  }
}

ESPRMUser.prototype.assumeRole = async function (
  request: AssumeRoleRequest
): Promise<AssumeRoleResponse> {
  // Validate userRole if provided
  const userRoleString = request.userRole;

  // Validate user_role if provided
  if (!isValidEnumValue(userRoleString, ESPUserRole)) {
    throw new ESPAPICallValidationError(
      APICallValidationErrorCodes.INVALID_ASSUME_ROLE_USER_ROLE
    );
  }

  // Validate that only one of groupIds or nodeIds is provided
  const hasGroupIds = request.groupIds && request.groupIds.length > 0;
  const hasNodeIds = request.nodeIds && request.nodeIds.length > 0;

  if (hasGroupIds && hasNodeIds) {
    throw new ESPAPICallValidationError(
      APICallValidationErrorCodes.INVALID_ASSUME_ROLE_PARAMS
    );
  }

  // Validate videostream requires nodeIds
  if (userRoleString === ESPUserRole.VIDEOSTREAM && !hasNodeIds) {
    throw new ESPAPICallValidationError(
      APICallValidationErrorCodes.MISSING_ASSUME_ROLE_NODE_IDS_FOR_VIDEOSTREAM
    );
  }

  // Validate nodeIds count
  validateAssumeRoleNodeIdsCount(request.nodeIds);

  // Validate groupIds count
  validateAssumeRoleGroupIdsCount(request.groupIds);

  // Build request body with snake_case for API (backend expects snake_case)
  const requestBody: Record<string, any> = {
    user_role: userRoleString,
    ...(request.groupIds !== undefined && { group_ids: request.groupIds }),
    ...(request.nodeIds !== undefined && { node_ids: request.nodeIds }),
  };

  const requestConfig = {
    url: APIEndpoints.USER_ASSUME_ROLE,
    method: HTTPMethods.POST,
    data: requestBody,
  };

  const response = await ESPRMAPIManager.authorizeRequest(requestConfig);

  return {
    accessKey: response.access_key,
    secretKey: response.secret_key,
    sessionToken: response.session_token,
  };
};
