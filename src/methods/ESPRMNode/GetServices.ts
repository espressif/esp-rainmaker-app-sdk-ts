/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMNode } from "../../ESPRMNode";
import { ESPRMAPIManager } from "../../services/ESPRMAPIManager";
import { APIEndpoints, HTTPMethods } from "../../utils/constants";
import { ESPRMNodeConfig } from "../../ESPRMNodeConfig";
import { ESPRMService } from "../../ESPRMService";
import { ESPRMServiceParam } from "../../ESPRMServiceParam";

/**
 * Augments the ESPRMNode class with the `getServices` method.
 */
declare module "../../ESPRMNode" {
  interface ESPRMNode {
    /**
     * Fetches the services for the current node.
     *
     * @returns {Promise<ESPRMService[]>} A promise that resolves to an array of updated services.
     */
    getServices(): Promise<ESPRMService[]>;
  }
}

/**
 * Fetches the services for the current node using its nodeId.
 *
 * @returns {Promise<ESPRMService[]>} A promise that resolves to an array of updated services.
 */
ESPRMNode.prototype.getServices = async function (): Promise<ESPRMService[]> {
  let nodeConfig: ESPRMNodeConfig | undefined = this.nodeConfig;
  if (!nodeConfig) {
    nodeConfig = await this.getNodeConfig();
  }

  const requestParams = {
    node_id: this.id,
  };

  const requestConfig = {
    url: APIEndpoints.USER_NODE_PARAM,
    method: HTTPMethods.GET,
    params: requestParams,
  };

  const serviceParamsValuesResponse =
    await ESPRMAPIManager.authorizeRequest(requestConfig);

  const updatedESPRMServiceList = nodeConfig.services?.map((service) => {
    const _service = { ...service };
    _service.params = updateServiceParamsValue(
      _service,
      serviceParamsValuesResponse,
      this
    );
    return new ESPRMService(_service, this);
  });

  return updatedESPRMServiceList!;
};

/**
 * Updates the values of service parameters based on the response.
 *
 * @param service - The service to update.
 * @param serviceParamsValues - The parameters values response from the API.
 * @returns {ESPRMServiceParam[]} An array of updated service parameters.
 */
const updateServiceParamsValue = (
  service: ESPRMService,
  serviceParamsValues: Record<string, any>,
  nodeRef: ESPRMNode
): ESPRMServiceParam[] => {
  return service.params.map((serviceParam) => {
    const _serviceParam = { ...serviceParam };
    _serviceParam.value = serviceParamsValues[service.name]?._serviceParam.name;
    return new ESPRMServiceParam(_serviceParam, nodeRef);
  });
};
