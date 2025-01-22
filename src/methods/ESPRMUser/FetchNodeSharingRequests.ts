/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPNodeSharingRequest } from "../../ESPNodeSharingRequest";
import { ESPRMAPIManager } from "../../services/ESPRMAPIManager";
import { transformNodeSharingRequestsResponse } from "../../services/ESPRMHelpers/TransformNodeSharingRequestsResponse";
import { FetchNodeSharingRequestsParam } from "../../types/input";
import {
  GetNodeSharingRequestsAPIResponse,
  ESPNodeSharingResponse,
} from "../../types/output";
import { ESPNodeSharingRequestInterface } from "../../types/ESPModules";
import { APIEndpoints, HTTPMethods } from "../../utils/constants";

/**
 * Fetches node sharing requests for a user with optional pagination.
 *
 * This function sends a request to the API to retrieve node sharing requests for the current user.
 * It supports pagination by using the `nextRequestId` and `nextUserName` for fetching subsequent data.
 *
 * @param {FetchNodeSharingRequestsParam} fetchNodeSharingRequestsParam - The parameters for filtering the node sharing requests.
 * @returns {Promise<ESPNodeSharingResponse>} A promise that resolves to a paginated response containing node sharing requests.
 */
const fetchNodeSharingRequests = async (
  fetchNodeSharingRequestsParam: FetchNodeSharingRequestsParam
): Promise<ESPNodeSharingResponse> => {
  let _nextRequestId: string | null = null;
  let _nextUserName: string | null = null;

  const requestParams = createRequestParams(fetchNodeSharingRequestsParam);

  const requestConfig = {
    url: APIEndpoints.USER_NODE_SHARING_REQUESTS,
    method: HTTPMethods.GET,
    params: requestParams,
  };

  const response: GetNodeSharingRequestsAPIResponse =
    await ESPRMAPIManager.authorizeRequest(requestConfig);

  const list: ESPNodeSharingRequestInterface[] =
    transformNodeSharingRequestsResponse(response.sharing_requests);

  const nodeSharingRequestList: ESPNodeSharingRequest[] = list.map(
    (nodeSharingRequest) => new ESPNodeSharingRequest(nodeSharingRequest)
  );

  _nextRequestId = response.next_request_id || null;
  _nextUserName = response.next_user_name || null;

  const responseData: ESPNodeSharingResponse = {
    sharedRequests: nodeSharingRequestList,
    hasNext: !!_nextRequestId,
  };

  const _fetchNodeSharingRequestsParam: FetchNodeSharingRequestsParam = {
    ...fetchNodeSharingRequestsParam,
    nextRequestId: _nextRequestId ?? undefined,
    nextUserName: _nextUserName ?? undefined,
  };

  if (_nextRequestId) {
    responseData.fetchNext = async () => {
      return fetchNodeSharingRequests(_fetchNodeSharingRequestsParam);
    };
  }

  return responseData;
};

/**
 * Creates request parameters for fetching node sharing requests based on the provided inputs.
 *
 * @param {FetchNodeSharingRequestsParam} fetchNodeSharingRequestsParam - The parameters for fetching node sharing requests, such as user details and pagination controls.
 * @returns {Record<string, any>} An object containing the request parameters in snake_case format, suitable for API requests.
 */
function createRequestParams(
  fetchNodeSharingRequestsParam: FetchNodeSharingRequestsParam
): Record<string, any> {
  return {
    primary_user: fetchNodeSharingRequestsParam.primaryUser,
    ...(fetchNodeSharingRequestsParam.recordsNumber && {
      num_records: fetchNodeSharingRequestsParam.recordsNumber,
    }),
    ...(fetchNodeSharingRequestsParam.nextRequestId && {
      start_request_id: fetchNodeSharingRequestsParam.nextRequestId,
    }),
    ...(fetchNodeSharingRequestsParam.nextUserName && {
      start_user_name: fetchNodeSharingRequestsParam.nextUserName,
    }),
  };
}

export { fetchNodeSharingRequests };
