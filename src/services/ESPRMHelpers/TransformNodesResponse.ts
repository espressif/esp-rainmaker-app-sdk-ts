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

type NodeTransformError = {
  nodeId?: string;
  index: number;
  reason: string;
};

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
};

const transformNodesResponse = (
  data: Record<string, any>,
  withNodeDetails: boolean | undefined
): ESPRMNodeInterface[] => {
  const transformedNodes: ESPRMNodeInterface[] = [];
  const nodeTransformErrors: NodeTransformError[] = [];

  if (!withNodeDetails) {
    return (data.nodes ?? []).map(
      (nodeId: string): ESPRMNodeInterface => ({
        id: nodeId,
        transportOrder: ESPRMBase.transportOrder,
        availableTransports: {},
      })
    );
  }

  const nodeDetailsList = data.node_details ?? [];

  for (const [nodeIndex, nodeDetails] of nodeDetailsList.entries()) {
    try {
      if (!nodeDetails?.config) {
        nodeTransformErrors.push({
          nodeId: nodeDetails?.node_id,
          index: nodeIndex,
          reason: "Skipping node because config is missing",
        });
        continue;
      }

      _nodeData = nodeDetails;

      transformedNodes.push({
        id: nodeDetails.node_id,
        type: nodeDetails.node_type,
        isPrimaryUser: nodeDetails.primary,
        connectivityStatus: transformNodeConnectivityStatus(nodeDetails.status),
        nodeConfig: transformNodeConfig(nodeDetails.config),
        metadata: nodeDetails.metadata,
        tags: nodeDetails.tags,
        transportOrder: ESPRMBase.transportOrder,
        availableTransports: nodeDetails?.status?.connectivity?.connected
          ? {
              [ESPTransportMode.cloud]: {
                type: ESPTransportMode.cloud,
                metadata: {},
              },
            }
          : {},
      });
    } catch (error) {
      nodeTransformErrors.push({
        nodeId: nodeDetails?.node_id,
        index: nodeIndex,
        reason: getErrorMessage(error),
      });
    } finally {
      _nodeData = undefined;
    }
  }

  if (nodeTransformErrors.length > 0) {
    console.warn("Node transform partial failures", nodeTransformErrors);
  }

  return transformedNodes;
};

const transformNodeConnectivityStatus = (
  connectivityStatusData: Record<string, any> | undefined
): ESPRMConnectivityStatusInterface | undefined => {
  if (!connectivityStatusData?.connectivity) {
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
  nodeDevicesData: Record<string, any>[] | undefined
): ESPRMDeviceInterface[] => {
  if (!nodeDevicesData || nodeDevicesData.length === 0) {
    return [];
  }

  return nodeDevicesData.map((nodeDeviceData) => {
    const deviceName = nodeDeviceData.name;
    const displayNameKey = nodeDeviceData.params?.find(
      (deviceParamData: Record<string, any>) =>
        deviceParamData.type === "esp.param.name"
    )?.name;
    const displayName =
      displayNameKey && _nodeData?.params?.[deviceName]?.[displayNameKey];
    const transformedParams = transformNodeDeviceParams(
      nodeDeviceData.params,
      deviceName
    );

    // Find the primary parameter from the transformed params
    let primaryParam: ESPRMDeviceParamInterface | undefined;
    if (nodeDeviceData.primary && transformedParams) {
      primaryParam = transformedParams.find(
        (param) => param.name === nodeDeviceData.primary
      );
    }

    return {
      name: deviceName,
      type: nodeDeviceData.type,
      attributes: transformNodeAttributes(nodeDeviceData.attributes),
      params: transformedParams,
      primaryParam: primaryParam,
      displayName: displayName ?? deviceName,
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
  deviceParamsData: Record<string, any>[] | undefined,
  deviceName: string
): ESPRMDeviceParamInterface[] | undefined => {
  if (!deviceParamsData || deviceParamsData.length === 0) {
    return undefined;
  }

  try {
    return deviceParamsData.map((deviceParamData) => {
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
  } catch (error) {
    throw new Error(
      `Failed to transform device params for device "${deviceName}" (paramsCount=${deviceParamsData.length}, hasNodeDataParams=${Boolean(
        _nodeData?.params
      )}): ${getErrorMessage(error)}`
    );
  }
};

const transformNodeServiceParams = (
  serviceParamsData: Record<string, any>[] | undefined,
  name: string
): ESPRMServiceParamInterface[] => {
  if (!serviceParamsData || serviceParamsData.length === 0) {
    return [];
  }

  try {
    return serviceParamsData.map((serviceParamData) => ({
      serviceName: name,
      name: serviceParamData.name,
      value:
        _nodeData?.params?.[name]?.[serviceParamData.name] ?? undefined,
      type: serviceParamData.type,
      dataType: serviceParamData.data_type,
      properties: serviceParamData.properties,
      bounds: serviceParamData.bounds,
      validStrings: serviceParamData.valid_strs,
    }));
  } catch (error) {
    throw new Error(
      `Failed to transform service params for service "${name}" (paramsCount=${serviceParamsData.length}, hasNodeDataParams=${Boolean(
        _nodeData?.params
      )}): ${getErrorMessage(error)}`
    );
  }
};

const transformNodeServices = (
  nodeServicesData: Record<string, any>[] | undefined
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
