/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMGroupInterface } from "../../types/input";
import { transformNodesResponse } from "./TransformNodesResponse";

/**
 * Transforms the raw groups info response from the API into a structured format.
 *
 * This function takes the raw API response for groups and maps it to a structured array of `ESPRMGroupInterface` objects.
 * It ensures that fields like node details and sub-groups are properly transformed and included in the result.
 *
 * @param groups - The raw groups info response from the API, which may include nested sub-groups and node details.
 * @returns An array of transformed groups, each conforming to the `ESPRMGroupInterface` format, or an empty array if no data is provided.
 */
const transformGroupsResponse = (
  groups?: Record<string, any>[]
): ESPRMGroupInterface[] => {
  let transformedGroupsResponse: ESPRMGroupInterface[] | undefined = undefined;

  transformedGroupsResponse = groups?.map(
    (group: Record<string, any>): ESPRMGroupInterface => {
      return {
        id: group.group_id,
        name: group.group_name,
        isPrimaryUser: group.primary,
        totalNodes: group.total,
        parentGroupId: group.parent_group_id,
        type: group.type,
        mutuallyExclusive: group.mutually_exclusive,
        nodes: group.nodes,
        nodeDetails: group.node_details
          ? transformNodesResponse(group, true)
          : undefined,
        subGroups: group.sub_groups
          ? transformGroupsResponse(group.sub_groups)
          : undefined,
        description: group.description,
        metadata: group.meta_data,
        customData: group.custom_data,
        isMatter: group.is_matter,
        fabricId: group.fabric_id,
      } as ESPRMGroupInterface;
    }
  );

  return transformedGroupsResponse || [];
};

export { transformGroupsResponse };
