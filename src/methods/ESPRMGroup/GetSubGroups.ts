/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMGroup } from "../../ESPRMGroup";
import { ESPRMAPIManager } from "../../services/ESPRMAPIManager";
import { transformGroupsResponse } from "../../services/ESPRMHelpers/TransformGroupsResponse";
import { APIEndpoints, HTTPMethods } from "../../utils/constants";

/**
 * Augments the ESPRMGroup class with the `getSubGroups` method to retrieve sub-groups of the current group.
 */
declare module "../../ESPRMGroup" {
  interface ESPRMGroup {
    /**
     * Retrieves the list of sub-groups for the current group.
     * @returns A promise that resolves to an array of `ESPRMGroup` instances representing the sub-groups.
     */
    getSubGroups(): Promise<ESPRMGroup[]>;
  }
}

/**
 * Retrieves the list of sub-groups for the current group.
 * @returns A promise that resolves to an array of `ESPRMGroup` instances representing the sub-groups.
 */
ESPRMGroup.prototype.getSubGroups = async function (): Promise<ESPRMGroup[]> {
  const requestData = {
    group_id: this.id,
    sub_groups: true,
  };

  const requestConfig = {
    url: APIEndpoints.USER_GROUP,
    method: HTTPMethods.GET,
    params: requestData,
  };

  const responseData = await ESPRMAPIManager.authorizeRequest(requestConfig);

  const data: Record<string, any>[] = responseData.groups[0]["sub_groups"];
  const transformedSubGroups = transformGroupsResponse(data);
  const subGroupsList: ESPRMGroup[] = transformedSubGroups.map(
    (group) => new ESPRMGroup(group)
  );
  return subGroupsList;
};
