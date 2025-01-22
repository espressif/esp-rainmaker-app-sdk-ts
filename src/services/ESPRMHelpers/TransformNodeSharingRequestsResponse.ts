/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPNodeSharingRequestInterface } from "../../types/ESPModules";

/**
 * Transforms the raw user info response from the API into a structured format.
 *
 * @param data - The raw user info response from the API.
 * @returns The transformed user info with specific fields mapped.
 */
const transformNodeSharingRequestsResponse = (
  data: Record<string, any>[]
): ESPNodeSharingRequestInterface[] => {
  const transformedNodeSharingRequest: ESPNodeSharingRequestInterface[] =
    data.map((nodeSharingRequest): ESPNodeSharingRequestInterface => {
      return {
        id: nodeSharingRequest.request_id,
        status: nodeSharingRequest.request_status,
        timestamp: nodeSharingRequest.request_timestamp,
        nodeIDs: nodeSharingRequest.node_ids,
        username: nodeSharingRequest.user_name,
        primaryUsername: nodeSharingRequest.primary_user_name,
        transfer: nodeSharingRequest.transfer,
        newRole: nodeSharingRequest.new_role,
        metadata: nodeSharingRequest.metadata,
      };
    });
  return transformedNodeSharingRequest;
};

export { transformNodeSharingRequestsResponse };
