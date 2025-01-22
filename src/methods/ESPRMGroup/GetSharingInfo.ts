/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPGroupSharingInfo } from "../../ESPGroupSharingInfo";
import { ESPRMGroup } from "../../ESPRMGroup";
import { ESPRMAPIManager } from "../../services/ESPRMAPIManager";
import { transformGroupSharingInfoResponse } from "../../services/ESPRMHelpers/TransformGroupSharingInfoResponse";
import { GetSharingInfoRequest } from "../../types/input";
import { APIEndpoints, HTTPMethods } from "../../utils/constants";

/**
 * Augments the ESPRMGroup class with the `getSharingInfo` method.
 * This method retrieves sharing information for a specific group.
 *
 * @param getSharingInfoRequestParams - The parameters required to fetch the sharing information.
 *
 * @returns A Promise that resolves to an `ESPGroupSharingInfo` instance containing the sharing information.
 */
declare module "../../ESPRMGroup" {
  interface ESPRMGroup {
    getSharingInfo(
      getSharingInfoRequestParams: GetSharingInfoRequest
    ): Promise<ESPGroupSharingInfo>;
  }
}

/**
 * Retrieves the sharing information for the current group by making a request to the server.
 *
 * This method constructs a request to fetch the group sharing information based on the provided parameters
 * and the group's `id`. It then transforms the response into a suitable format and returns the sharing info.
 *
 * @param getSharingInfoRequestParams - The parameters for the sharing info request.
 *
 * @returns A Promise that resolves to an instance of `ESPGroupSharingInfo` with the transformed response data.
 */
ESPRMGroup.prototype.getSharingInfo = async function (
  getSharingInfoRequestParams: GetSharingInfoRequest
): Promise<ESPGroupSharingInfo> {
  const requestData = createRequestData(getSharingInfoRequestParams, this.id);

  const requestConfig = {
    url: APIEndpoints.USER_GROUP_SHARING,
    method: HTTPMethods.GET,
    params: requestData,
  };

  const responseData = await ESPRMAPIManager.authorizeRequest(requestConfig);
  const groupSharingInfo = responseData["group_sharing"][0]; // always be single element as we are making request with group_id
  const transformedGroupSharingInfo = transformGroupSharingInfoResponse(
    groupSharingInfo,
    getSharingInfoRequestParams.metadata
  );
  return new ESPGroupSharingInfo(transformedGroupSharingInfo);
};

/**
 * Creates the request data for the group sharing information request.
 *
 * @param getSharingInfoRequestParams - The parameters to customize the sharing info request.
 * @param groupId - The ID of the group to fetch the sharing info for.
 *
 * @returns A record containing the request data, including optional parameters like `sub_groups`, `parent_groups`, and `metadata`.
 */
function createRequestData(
  getSharingInfoRequestParams: GetSharingInfoRequest,
  groupId: string
): Record<string, any> {
  return {
    group_id: groupId,
    ...(getSharingInfoRequestParams.withSubGroups !== undefined && {
      sub_groups: getSharingInfoRequestParams.withSubGroups,
    }),
    ...(getSharingInfoRequestParams.withParentGroups !== undefined && {
      parent_groups: getSharingInfoRequestParams.withParentGroups,
    }),
    ...(getSharingInfoRequestParams.metadata !== undefined && {
      metadata: getSharingInfoRequestParams.metadata,
    }),
  };
}
