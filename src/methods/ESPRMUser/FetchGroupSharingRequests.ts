/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPGroupSharingRequest } from "../../ESPGroupSharingRequest";
import { ESPRMAPIManager } from "../../services/ESPRMAPIManager";
import { transformGroupSharingRequestsResponse } from "../../services/ESPRMHelpers/TransformGroupSharingRequestsResponse";
import { FetchGroupSharingRequestsParam } from "../../types/input";
import {
  ESPGroupSharingResponse,
  GetGroupSharingRequestsAPIResponse,
} from "../../types/output";
import { ESPGroupSharingRequestInterface } from "../../types/ESPModules";
import { APIEndpoints, HTTPMethods } from "../../utils/constants";

/**
 * Fetches group sharing requests for a user with optional pagination.
 *
 * This function sends a request to the API to retrieve group sharing requests for the current user.
 * It supports pagination by using the `nextRequestId` and `nextUserName` for fetching subsequent data.
 *
 * @param {FetchGroupSharingRequestsParam} fetchGroupSharingRequestsParam - The parameters for filtering the group sharing requests.
 * @returns {Promise<ESPGroupSharingResponse>} A promise that resolves to a paginated response containing group sharing requests.
 */
const fetchGroupSharingRequests = async (
  fetchGroupSharingRequestsParam: FetchGroupSharingRequestsParam
): Promise<ESPGroupSharingResponse> => {
  let _nextRequestId: string | null = null;
  let _nextUserName: string | null = null;

  const requestParams = createRequestParams(fetchGroupSharingRequestsParam);

  const requestConfig = {
    url: APIEndpoints.USER_GROUP_SHARING_REQUESTS,
    method: HTTPMethods.GET,
    params: requestParams,
  };

  const response: GetGroupSharingRequestsAPIResponse =
    await ESPRMAPIManager.authorizeRequest(requestConfig);

  const list: ESPGroupSharingRequestInterface[] =
    transformGroupSharingRequestsResponse(response.sharing_requests);

  const groupSharingRequestList: ESPGroupSharingRequest[] = list.map(
    (groupSharingRequest) => new ESPGroupSharingRequest(groupSharingRequest)
  );

  _nextRequestId = response.next_request_id || null;
  _nextUserName = response.next_user_name || null;

  const responseData: ESPGroupSharingResponse = {
    sharedRequests: groupSharingRequestList,
    hasNext: !!_nextRequestId,
  };

  const _fetchGroupSharingRequestsParam: FetchGroupSharingRequestsParam = {
    ...fetchGroupSharingRequestsParam,
    nextRequestId: _nextRequestId ?? undefined,
    nextUserName: _nextUserName ?? undefined,
  };

  if (_nextRequestId) {
    responseData.fetchNext = async () => {
      return fetchGroupSharingRequests(_fetchGroupSharingRequestsParam);
    };
  }

  return responseData;
};

/**
 * Creates request parameters for fetching group sharing requests based on the provided inputs.
 *
 * @param {FetchGroupSharingRequestsParam} fetchGroupSharingRequestsParam - The parameters for fetching group sharing requests, such as user details and pagination controls.
 * @returns {Record<string, any>} An object containing the request parameters in snake_case format, suitable for API requests.
 */
function createRequestParams(
  fetchGroupSharingRequestsParam: FetchGroupSharingRequestsParam
): Record<string, any> {
  return {
    primary_user: fetchGroupSharingRequestsParam.primaryUser,
    ...(fetchGroupSharingRequestsParam.recordsNumber && {
      num_records: fetchGroupSharingRequestsParam.recordsNumber,
    }),
    ...(fetchGroupSharingRequestsParam.nextRequestId && {
      start_request_id: fetchGroupSharingRequestsParam.nextRequestId,
    }),
    ...(fetchGroupSharingRequestsParam.nextUserName && {
      start_user_name: fetchGroupSharingRequestsParam.nextUserName,
    }),
  };
}

export { fetchGroupSharingRequests };
