/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMAPIManager } from "../../services/ESPRMAPIManager";
import { ESPAPIResponse } from "../../types";
import {
  ESPRMConnectivityStatusInterface,
  ESPRMNodeConfigInterface,
  ESPRMServiceInterface,
  ESPRMServiceParamInterface,
} from "../../types/node";
import {
  APIEndpoints,
  HTTPMethods,
  Keys,
  ESPServiceType,
  ESPServiceParamType,
} from "../../utils/constants";
import { isObjectEmpty, isValidObject } from "../../utils/validator/validators";
import {
  transformNodeConfig,
  transformNodeConnectivityStatus,
} from "./TransformNodesResponse";

export interface TimeServiceParamsInterface {
  timeService: ESPRMServiceInterface;
  timeZoneParam: ESPRMServiceParamInterface;
}

/**
 * Provides methods to set up the time zone for a node.
 */
export const NodeTimeZoneSetupService = {
  /**
   * Fetches the user's time zone from user's custom data.
   * @returns A promise that resolves to the user's time zone string or undefined if not found.
   */
  async getUserTimeZone(): Promise<string | undefined> {
    let userTimeZone: string | undefined = undefined;
    const requestConfig = {
      url: APIEndpoints.USER_CUSTOM_DATA,
      method: HTTPMethods.GET,
    };
    const response = await ESPRMAPIManager.authorizeRequest(requestConfig);
    if (isValidObject(response) && !isObjectEmpty(response)) {
      userTimeZone = response[Keys.TIMEZONE]?.value;
    }
    return userTimeZone;
  },

  /**
   * Retrieves the node configuration required to set the time zone.
   * @param nodeId - The ID of the node.
   * @returns A promise that resolves to the node configuration object.
   */
  async getNodeConfig(nodeId: string): Promise<ESPRMNodeConfigInterface> {
    const requestParams = {
      node_id: nodeId,
    };

    const requestConfig = {
      url: APIEndpoints.USER_NODE_CONFIG,
      method: HTTPMethods.GET,
      params: requestParams,
    };

    const response = await ESPRMAPIManager.authorizeRequest(requestConfig);
    const transformedNodeConfigResponse = transformNodeConfig(response);
    return transformedNodeConfigResponse!;
  },

  /**
   * Extracts the time service and its time zone parameter from the node configuration.
   * @param nodeConfig - The node configuration object.
   * @returns A promise that resolves to the time service parameters or null if not found.
   */
  async extractTimeServiceFromNodeConfig(
    nodeConfig: ESPRMNodeConfigInterface
  ): Promise<TimeServiceParamsInterface | null> {
    const timeService = nodeConfig.services?.find((service) => {
      return service.type === ESPServiceType.TIME;
    });

    if (!timeService) {
      return null;
    }
    const timeZoneParam = timeService.params.find((param) => {
      return param.type === ESPServiceParamType.TIME.TIMEZONE;
    });
    if (!timeZoneParam) {
      return null;
    }
    const timeServiceParams: TimeServiceParamsInterface = {
      timeService,
      timeZoneParam,
    };
    return timeServiceParams;
  },

  /**
   * Constructs the payload for setting the time zone on a node.
   * @param nodeId - The ID of the node.
   * @param timeServiceParams - The time service parameters.
   * @param timeZoneString - The time zone string to set.
   * @returns The constructed payload object.
   */
  constructTimeZonePayload(
    nodeId: string,
    timeServiceParams: TimeServiceParamsInterface,
    timeZoneString: string
  ): Record<string, any> {
    const { timeService, timeZoneParam } = timeServiceParams;
    const payload = {
      node_id: nodeId,
      payload: {
        [timeService.name]: {
          [timeZoneParam.name]: timeZoneString,
        },
      },
    };
    return payload;
  },

  /**
   * Retrieves the connectivity status of a node.
   * @param nodeId - The ID of the node.
   * @returns A promise that resolves to the node's connectivity status object.
   */
  async getNodeConnectivityStatus(
    nodeId: string
  ): Promise<ESPRMConnectivityStatusInterface> {
    const requestParams = {
      node_id: nodeId,
    };

    const requestConfig = {
      url: APIEndpoints.USER_NODE_STATUS,
      method: HTTPMethods.GET,
      params: requestParams,
    };

    const response = await ESPRMAPIManager.authorizeRequest(requestConfig);
    const transformedNodeConnectivityStatus =
      transformNodeConnectivityStatus(response);
    return transformedNodeConnectivityStatus!;
  },

  /**
   * Waits for a node to become connected, retrying at intervals.
   * @param nodeId - The ID of the node.
   * @param progressCallback - A callback function to report progress.
   * @param maxRetries - The maximum number of retries (default is 5).
   * @param interval - The interval between retries in milliseconds (default is 5000).
   * @returns A promise that resolves to true if the node is connected, or false if retries are exhausted.
   */
  async waitForNodeConnectivity(
    nodeId: string,
    progressCallback: () => void,
    maxRetries = 5,
    interval = 5000
  ): Promise<boolean> {
    let isProgressReported = false;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      if (!isProgressReported) {
        progressCallback();
        isProgressReported = true; // Ensure it is called only once
      }

      const { isConnected } = await this.getNodeConnectivityStatus(nodeId);
      if (isConnected) {
        return true; // Node is connected, proceed
      }

      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, interval)); // Wait before retrying
      }
    }

    return false; // Connectivity failed after max retries
  },

  /**
   * Sets the time zone for a node.
   * @param payload - The payload containing the time zone data.
   * @param progressCallback - A callback function to report progress.
   * @returns A promise that resolves to the API response.
   */
  async setNodeTimeZone(
    payload: Record<string, any>,
    progressCallback: () => void
  ): Promise<ESPAPIResponse> {
    progressCallback();
    const requestConfig = {
      url: APIEndpoints.USER_NODE_PARAM,
      method: HTTPMethods.PUT,
      data: [payload],
    };
    const response = await ESPRMAPIManager.authorizeRequest(requestConfig);
    return response as ESPAPIResponse;
  },
};
