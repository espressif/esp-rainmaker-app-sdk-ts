/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMBase } from "../../ESPRMBase";
import {
  ESPRMAttributeInterface,
  ESPRMConnectivityStatusInterface,
  ESPRMDeviceInterface,
  ESPRMNodeConfigInterface,
  ESPRMNodeInfoInterface,
  ESPRMNodeInterface,
  ESPRMDeviceParamInterface,
  ESPRMServiceInterface,
  ESPRMServiceParamInterface,
} from "../../types/node";
import { ESPTransportMode } from "../../types/transport";
import { copyAdditionalFields } from "./CopyAdditionalFields";

/**
 * Transforms the raw node info response from the API into a structured format.
 *
 * @param data - The raw node info response from the API.
 * @param withNodeDetails - Flag to indicate if detailed node information is required.
 * @returns An array of transformed node information.
 */
let _nodeData: Record<string, any> | undefined = undefined;
let dynamicDeviceNameKey: string | undefined = undefined;

const transformNodesResponse = (
  data: Record<string, any>,
  withNodeDetails: boolean | undefined
): ESPRMNodeInterface[] => {
  let transformedNodeResponse: ESPRMNodeInterface[];

  if (withNodeDetails) {
    transformedNodeResponse = data.node_details?.map(
      (node: Record<string, any>): ESPRMNodeInterface => {
        _nodeData = node;
        return {
          id: node.node_id,
          type: node.node_type,
          isPrimaryUser: node.primary,
          connectivityStatus: transformNodeConnectivityStatus(node.status),
          nodeConfig: transformNodeConfig(node.config),
          metadata: node.metadata,
          tags: node.tags,
          transportOrder: ESPRMBase.transportOrder,
          availableTransports: node.status.connectivity.connected
            ? {
                [ESPTransportMode.cloud]: {
                  type: ESPTransportMode.cloud,
                  metadata: null,
                },
              }
            : {},
        };
      }
    );
  } else {
    transformedNodeResponse = data.nodes?.map(
      (nodeId: string): ESPRMNodeInterface => ({
        id: nodeId,
        transportOrder: ESPRMBase.transportOrder,
        availableTransports: {},
      })
    );
  }
  _nodeData = undefined;
  dynamicDeviceNameKey = undefined;
  return transformedNodeResponse ?? [];
};

const transformNodeConnectivityStatus = (
  connectivityStatusData: Record<string, any> | undefined
): ESPRMConnectivityStatusInterface | undefined => {
  if (!connectivityStatusData) {
    return undefined;
  }

  return {
    isConnected: connectivityStatusData.connectivity.connected,
    lastConnectionTimestamp: connectivityStatusData.connectivity.timestamp,
  };
};

const transformNodeConfig = (
  nodeConfigData: Record<string, any> | undefined
): ESPRMNodeConfigInterface | undefined => {
  if (!nodeConfigData) {
    return undefined;
  }

  return {
    configVersion: nodeConfigData.config_version,
    attributes: transformNodeAttributes(nodeConfigData.attributes),
    devices: transformNodeDevices(nodeConfigData.devices),
    info: transformNodeInfo(nodeConfigData.info),
    services: transformNodeServices(nodeConfigData.services),
  };
};

const transformNodeAttributes = (
  nodeAttributesData: Record<string, any>[] | undefined
): ESPRMAttributeInterface[] | undefined => {
  if (!nodeAttributesData || nodeAttributesData.length === 0) {
    return undefined;
  }

  return nodeAttributesData.map((nodeAttributeData) => ({
    name: nodeAttributeData.name,
    value: nodeAttributeData.value,
  }));
};

const transformNodeDevices = (
  nodeDevicesData: Record<string, any>[]
): ESPRMDeviceInterface[] => {
  return nodeDevicesData.map((nodeDeviceData) => {
    const transformedParams = transformNodeDeviceParams(
      nodeDeviceData.params,
      nodeDeviceData.name
    );

    // Find the primary parameter from the transformed params
    let primaryParam: ESPRMDeviceParamInterface | undefined;
    if (nodeDeviceData.primary && transformedParams) {
      primaryParam = transformedParams.find(
        (param) => param.name === nodeDeviceData.primary
      );
    }

    return {
      name: nodeDeviceData.name,
      type: nodeDeviceData.type,
      attributes: transformNodeAttributes(nodeDeviceData.attributes),
      params: transformedParams,
      primaryParam: primaryParam,
      displayName:
        _nodeData && dynamicDeviceNameKey
          ? _nodeData.params[nodeDeviceData.name][dynamicDeviceNameKey]
          : nodeDeviceData.name,
    };
  });
};

const transformNodeInfo = (
  nodeInfoData: Record<string, any>
): ESPRMNodeInfoInterface => {
  // Start with the known/expected fields with proper mapping
  const transformedInfo: ESPRMNodeInfoInterface = {
    name: nodeInfoData.name,
    type: nodeInfoData.type,
    model: nodeInfoData.model,
    firmwareVersion: nodeInfoData.fw_version,
    ...(nodeInfoData.readme !== undefined && { readme: nodeInfoData.readme }),
  };

  // Add any additional fields that might be present in the API response
  // but are not part of the known fields
  const knownFields = new Set([
    "name",
    "type",
    "model",
    "fw_version",
    "readme",
  ]);
  copyAdditionalFields(nodeInfoData, transformedInfo, knownFields);

  return transformedInfo;
};

const transformNodeDeviceParams = (
  deviceParamsData: Record<string, any>[],
  deviceName: string
): ESPRMDeviceParamInterface[] | undefined => {
  if (!deviceParamsData || deviceParamsData.length === 0) {
    return undefined;
  }

  return deviceParamsData.map((deviceParamData) => {
    if (deviceParamData.type === "esp.param.name") {
      dynamicDeviceNameKey = deviceParamData.name;
    }

    return {
      deviceName,
      name: deviceParamData.name,
      value:
        _nodeData?.params?.[deviceName]?.[deviceParamData.name] ?? undefined,
      type: deviceParamData.type,
      dataType: deviceParamData.data_type,
      uiType: deviceParamData.ui_type,
      properties: deviceParamData.properties,
      bounds: deviceParamData.bounds,
      validStrings: deviceParamData.valid_strs,
    };
  });
};

const transformNodeServiceParams = (
  serviceParamsData: Record<string, any>[],
  name: string
): ESPRMServiceParamInterface[] => {
  return serviceParamsData.map((serviceParamData) => ({
    serviceName: name,
    name: serviceParamData.name,
    value: _nodeData?.params[name][serviceParamData.name] ?? undefined,
    type: serviceParamData.type,
    dataType: serviceParamData.data_type,
    properties: serviceParamData.properties,
    bounds: serviceParamData.bounds,
    validStrings: serviceParamData.valid_strs,
  }));
};

const transformNodeServices = (
  nodeServicesData: Record<string, any>[]
): ESPRMServiceInterface[] | undefined => {
  if (!nodeServicesData || nodeServicesData.length === 0) {
    return undefined;
  }

  return nodeServicesData.map((nodeServiceData) => ({
    name: nodeServiceData.name,
    params: transformNodeServiceParams(
      nodeServiceData.params,
      nodeServiceData.name
    ),
    type: nodeServiceData.type,
  }));
};

export {
  transformNodesResponse,
  transformNodeConnectivityStatus,
  transformNodeConfig,
  transformNodeAttributes,
  transformNodeDevices,
  transformNodeInfo,
  transformNodeDeviceParams,
  transformNodeServiceParams,
  transformNodeServices,
};
