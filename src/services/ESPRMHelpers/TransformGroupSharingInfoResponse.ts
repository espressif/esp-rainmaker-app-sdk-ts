/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ESPGroupSharingInfoInterface,
  ESPGroupSharingUserInfoInterface,
} from "../../types/input";

/**
 * Transforms the raw group sharing info response from the API into a structured format.
 *
 * This function maps the raw API response for group sharing information to a structured `ESPGroupSharingInfoInterface`.
 * It handles transforming users and sub-groups, with an optional flag to include user metadata.
 *
 * @param data - The raw group sharing info response from the API.
 * @param metadataFlag - Optional flag to indicate whether to include user metadata in the transformation.
 * @returns The transformed group sharing info in the `ESPGroupSharingInfoInterface` format.
 */
const transformGroupSharingInfoResponse = (
  data: any,
  metadataFlag?: boolean
): ESPGroupSharingInfoInterface => {
  return {
    groupId: data.group_id,
    mutuallyExclusive: data.mutually_exclusive || false,
    primaryUsers: data.users
      ? metadataFlag
        ? transformUsers(data.users.primary_metadata, true)
        : transformUsers(data.users.primary, false)
      : undefined,
    secondaryUsers: data.users
      ? metadataFlag
        ? transformUsers(data.users.secondary_metadata, true)
        : transformUsers(data.users.secondary, false)
      : undefined,
    subGroupsInfo: data.sub_groups
      ? data.sub_groups.map((subGroup: any) =>
          transformGroupSharingInfoResponse(subGroup, metadataFlag)
        )
      : undefined,
    parentGroupsInfo: data.parent_groups
      ? data.parent_groups.map((parentGroup: any) =>
          transformGroupSharingInfoResponse(parentGroup, metadataFlag)
        )
      : undefined,
  };
};

/**
 * Transforms the raw user data into a structured array of `ESPGroupSharingUserInfoInterface`.
 *
 * This helper function handles the transformation of user information, optionally including metadata.
 *
 * @param users - The raw user data to be transformed.
 * @param isMetadata - Flag indicating whether the transformation should include user metadata.
 * @returns An array of transformed user info in the `ESPGroupSharingUserInfoInterface` format.
 */
const transformUsers = (
  users: any[],
  isMetadata: boolean
): ESPGroupSharingUserInfoInterface[] => {
  if (!isMetadata) {
    // metadata: false case
    return users?.map(
      (username: string): ESPGroupSharingUserInfoInterface => ({
        username,
      })
    );
  } else {
    // metadata: true case
    return users?.map(
      (user: Record<string, any>): ESPGroupSharingUserInfoInterface => ({
        username: user.user_name,
        metadata: user.metadata || undefined,
      })
    );
  }
};

export { transformGroupSharingInfoResponse };
