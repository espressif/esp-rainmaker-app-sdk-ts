/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMUser } from "../../ESPRMUser";
import { FetchGroupSharingRequestsParam } from "../../types/input";
import { ESPGroupSharingResponse } from "../../types/output";
import { fetchGroupSharingRequests } from "./FetchGroupSharingRequests";

declare module "../../ESPRMUser" {
  /**
   * Extension of the ESPRMUser class to include a method for retrieving issued group sharing requests.
   *
   * @param count - The number of records to retrieve. If not provided, defaults to a set value.
   *
   * @returns A Promise resolving to the response containing group sharing requests.
   */
  interface ESPRMUser {
    getIssuedGroupSharingRequests(
      count?: number
    ): Promise<ESPGroupSharingResponse>;
  }
}

/**
 * Retrieves the group sharing requests issued by the user.
 *
 * This method uses a helper function to fetch the group sharing requests issued by the user by providing
 * the necessary parameters, including the number of records to be returned. If the `count` parameter is
 * not provided, a default number of records is used.
 *
 * @param count - The number of group sharing requests to fetch (optional).
 *
 * @returns A Promise that resolves to an `ESPGroupSharingResponse` object containing the retrieved requests.
 */
ESPRMUser.prototype.getIssuedGroupSharingRequests = async function (
  count
): Promise<ESPGroupSharingResponse> {
  const request: FetchGroupSharingRequestsParam = {
    primaryUser: true,
    recordsNumber: count,
  };

  return await fetchGroupSharingRequests(request);
};
