/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMGroup } from "../../ESPRMGroup";
import { ESPRMAPIManager } from "../../services/ESPRMAPIManager";
import { UpdateGroupInfoRequest } from "../../types/input";
import { ESPAPIResponse } from "../../types/output";
import {
  APICallValidationErrorCodes,
  APIEndpoints,
  HTTPMethods,
} from "../../utils/constants";
import { ESPAPICallValidationError } from "../../utils/error/Error";
import { isObjectEmpty } from "../../utils/validator/validators";

/**
 * Augments the ESPRMGroup class with the `updateGroupInfo` method to update the group's details.
 */
declare module "../../ESPRMGroup" {
  interface ESPRMGroup {
    /**
     * Updates the information of the current group.
     *
     * @param {UpdateGroupInfoRequest} updateInfo - The new information for the group.
     * @returns {Promise<ESPAPIResponse>} A promise that resolves to the API success response.
     */
    updateGroupInfo(
      updateInfo: UpdateGroupInfoRequest
    ): Promise<ESPAPIResponse>;
  }
}

/**
 * Implementation of the `updateGroupInfo` method for the `ESPRMGroup` class.
 *
 * This method sends a PUT request to the API to update the group's information.
 * The group ID is taken from the instance of `ESPRMGroup`, and the new group information
 * is provided as input.
 *
 * @param {UpdateGroupInfoRequest} updateInfo - The information about the group to update.
 * @returns {Promise<ESPAPIResponse>} A promise that resolves with the success response from the API.
 */
ESPRMGroup.prototype.updateGroupInfo = async function (
  updateInfo: UpdateGroupInfoRequest
): Promise<ESPAPIResponse> {
  if (isObjectEmpty(updateInfo)) {
    throw new ESPAPICallValidationError(
      APICallValidationErrorCodes.MISSING_GROUP_UPDATE_INFO
    );
  }

  const requestParams = { group_id: this.id };

  const requestData = createRequestData(updateInfo);

  const requestConfig = {
    url: APIEndpoints.USER_GROUP,
    method: HTTPMethods.PUT,
    data: requestData,
    params: requestParams,
  };

  const response = await ESPRMAPIManager.authorizeRequest(requestConfig);
  return response as ESPAPIResponse;
};

/**
 * Helper function to create request data from updateInfo.
 *
 * @param {UpdateGroupInfoRequest} updateInfo - The information about the group to update.
 * @returns {Record<string, any>} An object containing the request data in snake_case format.
 */
function createRequestData(
  updateInfo: UpdateGroupInfoRequest
): Record<string, any> {
  return {
    ...(updateInfo.groupName !== undefined && {
      group_name: updateInfo.groupName,
    }),
    ...(updateInfo.type !== undefined && { type: updateInfo.type }),
    ...(updateInfo.mutuallyExclusive !== undefined && {
      mutually_exclusive: updateInfo.mutuallyExclusive,
    }),
    ...(updateInfo.description !== undefined && {
      description: updateInfo.description,
    }),
    ...(updateInfo.groupMetaData !== undefined && {
      group_meta_data: updateInfo.groupMetaData,
    }),
    ...(updateInfo.customData !== undefined && {
      custom_data: updateInfo.customData,
    }),
  };
}
