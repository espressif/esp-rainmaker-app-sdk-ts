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
 * Base interface for parameter properties common to both device and service parameters.
 */
interface ESPRMParamInterface extends ESPRMAttributeInterface {
  type: string;
  properties: string[];
  dataType: string;
  bounds?: Record<string, any>;
  validStrings?: string[];
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
  readme?: string;
  // Allow additional fields that might be added in future API responses
  [key: string]: any;
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
 * Represents the parameter of a node device
 */
interface ESPRMDeviceParamInterface extends ESPRMParamInterface {
  // nodeId: string;
  deviceName: string;
  uiType?: string;
}

/**
 * Represents the parameter of a node service
 */
interface ESPRMServiceParamInterface extends ESPRMParamInterface {
  serviceName: string;
}

export {
  ESPRMNodeInterface,
  ESPRMConnectivityStatusInterface,
  ESPRMNodeConfigInterface,
  ESPRMNodeInfoInterface,
  ESPRMDeviceInterface,
  ESPRMAttributeInterface,
  ESPRMParamInterface,
  ESPRMDeviceParamInterface,
  ESPRMServiceInterface,
  ESPRMServiceParamInterface,
};
