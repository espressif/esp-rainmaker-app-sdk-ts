/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPTransportConfig, ESPTransportMode } from "./transport";

/**
 * Represents the node in the system.
 */
interface ESPRMNodeInterface {
  id: string;
  type?: string;
  isPrimaryUser?: boolean;
  connectivityStatus?: ESPRMConnectivityStatusInterface;
  nodeConfig?: ESPRMNodeConfigInterface;
  metadata?: Record<string, any>;
  tags?: string[];
  role?: string;
  transportOrder: ESPTransportMode[] | [];
  availableTransports:
    | Partial<Record<ESPTransportMode, ESPTransportConfig>>
    | {};
}

/**
 * Represents the connectivity status of a node.
 */
interface ESPRMConnectivityStatusInterface {
  isConnected: boolean;
  lastConnectionTimestamp: number;
}

/**
 * Represents the configuration of a node.
 */
interface ESPRMNodeConfigInterface {
  configVersion: string;
  attributes?: ESPRMAttributeInterface[];
  devices: ESPRMDeviceInterface[];
  info: ESPRMNodeInfoInterface;
  services?: ESPRMServiceInterface[];
}

/**
 * Represents an attribute of a node or device.
 */
interface ESPRMAttributeInterface {
  name: string;
  value?: any;
}

/**
 * Represents the device associated with a node.
 */
interface ESPRMDeviceInterface {
  name: string;
  displayName: string;
  type: string;
  attributes?: ESPRMAttributeInterface[];
  params?: ESPRMDeviceParamInterface[];
  primaryParam?: ESPRMDeviceParamInterface;
}

/**
 * Represents the information about a node.
 */
interface ESPRMNodeInfoInterface {
  name: string;
  type: string;
  model: string;
  firmwareVersion: string;
}

/**
 * Represents the service associated with a node.
 */
interface ESPRMServiceInterface {
  name: string;
  params: ESPRMServiceParamInterface[];
  type: string;
}

/**
 * Represents the parameter of a node device, including additional metadata.
 */
interface ESPRMDeviceParamInterface extends ESPRMAttributeInterface {
  // nodeId: string;
  deviceName: string;
  type: string;
  uiType: string;
  properties: string[];
  bounds: Record<string, any>;
  dataType: string;
}

/**
 * Represents the parameter of a node service, including additional metadata.
 */
interface ESPRMServiceParamInterface extends ESPRMAttributeInterface {
  type: string;
  properties: string[];
  dataType: string;
}

export {
  ESPRMNodeInterface,
  ESPRMConnectivityStatusInterface,
  ESPRMNodeConfigInterface,
  ESPRMNodeInfoInterface,
  ESPRMDeviceInterface,
  ESPRMAttributeInterface,
  ESPRMDeviceParamInterface,
  ESPRMServiceInterface,
  ESPRMServiceParamInterface,
};
