/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMAPIManager } from "../ESPRMAPIManager";
import { APIEndpoints, HTTPMethods } from "../../utils/constants";
import { ESPAutomation } from "../../ESPAutomation";
import { ESPPaginatedAutomationsResponse } from "../../types/automation";
import { transformAutomationsResponse } from "./TransformAutomationsResponse";

interface FetchAutomationsParams {
  nodeId?: string;
  nextId?: string;
}

export const fetchAutomations = async ({
  nodeId,
  nextId,
}: FetchAutomationsParams): Promise<ESPPaginatedAutomationsResponse> => {
  const requestConfig = {
    url: APIEndpoints.USER_NODE_AUTOMATION,
    method: HTTPMethods.GET,
    params: {
      ...(nodeId && { node_id: nodeId }),
      ...(nextId && { start_id: nextId }),
    },
  };

  const response = await ESPRMAPIManager.authorizeRequest(requestConfig);

  // Transform the response into the expected format
  const automations = (response.automation_trigger_actions || []).map(
    (automation: any) => {
      const transformedAutomation = transformAutomationsResponse(automation);
      return new ESPAutomation(transformedAutomation);
    }
  );

  const nextIdResponse = response.next_id || null;

  const responseData: ESPPaginatedAutomationsResponse = {
    automations,
    hasNext: !!nextIdResponse,
  };

  if (nextIdResponse) {
    responseData.fetchNext = async () => {
      return fetchAutomations({ nodeId, nextId: nextIdResponse });
    };
  }

  return responseData;
};
