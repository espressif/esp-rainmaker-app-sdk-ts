/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPGroupSharingRequestInterface } from "../../types/ESPModules";

/**
 * Transforms raw data from a group sharing requests response into an array of `ESPGroupSharingRequestInterface` objects.
 *
 * This function maps over the raw response data and converts each item into a structured object that conforms to the
 * `ESPGroupSharingRequestInterface`, ensuring consistency and proper typing.
 *
 * @param data - An array of raw group sharing request data objects.
 * @returns An array of transformed group sharing request objects, each conforming to `ESPGroupSharingRequestInterface`.
 */
const transformGroupSharingRequestsResponse = (
  data: Record<string, any>[]
): ESPGroupSharingRequestInterface[] => {
  const transformedGroupSharingRequest: ESPGroupSharingRequestInterface[] =
    data.map((groupSharingRequest): ESPGroupSharingRequestInterface => {
      return {
        id: groupSharingRequest.request_id,
        status: groupSharingRequest.request_status,
        timestamp: groupSharingRequest.request_timestamp,
        groupIds: groupSharingRequest.group_ids,
        groupnames: groupSharingRequest.group_names,
        username: groupSharingRequest.user_name,
        primaryUsername: groupSharingRequest.primary_user_name,
        transfer: groupSharingRequest.transfer,
        newRole: groupSharingRequest.new_role,
        metadata: groupSharingRequest.metadata,
      };
    });
  return transformedGroupSharingRequest;
};

export { transformGroupSharingRequestsResponse };
