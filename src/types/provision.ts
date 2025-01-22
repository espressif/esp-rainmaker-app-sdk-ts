/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Represents the types of transport mechanisms available.
 */
enum ESPTransport {
  ble = "ble",
  softap = "softap",
}

/**
 * Represents the levels of security available.
 */
enum ESPSecurity {
  unsecure,
  secure,
  secure2,
}

/**
 * Represents the status of the connection.
 */
enum ESPConnectStatus {
  connected,
  failedToConnect,
  disconnected,
}

/**
 * Represents the status of the provisioning process.
 */
enum ESPProvisionStatus {
  success,
  failure,
}

/**
 * Represents a list of WiFi networks.
 */
interface ESPWifiList {
  ssid: string;
  rssi: number;
  auth: number;
  bssid?: string;
  channel?: number;
}

/**
 * Represents a device with various properties.
 */
interface ESPDeviceInterface {
  name: string;
  security: number;
  transport: string;
  connected?: boolean;
  username?: string;
  versionInfo?: { [key: string]: any }[];
  capabilities?: string[];
  advertisementData?: { [key: string]: any }[];
}

/**
 * Represents the methods available for provisioning a device.
 */
interface ESPProvisionAdapterInterface {
  searchESPDevices(
    devicePrefix: string,
    transport: ESPTransport
  ): Promise<ESPDeviceInterface[]>;
  stopESPDevicesSearch(): Promise<void>;
  createESPDevice(
    name: string,
    transport: string,
    security?: number,
    proofOfPossession?: string,
    softAPPassword?: string,
    username?: string
  ): Promise<ESPDeviceInterface>;
  connect(deviceName: string): Promise<ESPProvResponse>;
  getDeviceCapabilities(deviceName: string): Promise<string[]>;
  setProofOfPossession(
    deviceName: string,
    proofOfPossession: string
  ): Promise<boolean>;
  initializeSession(deviceName: string): Promise<boolean>;
  scanWifiList(deviceName: string): Promise<ESPWifiList[]>;
  sendData(deviceName: string, endPoint: string, data: string): Promise<string>;
  provision(
    deviceName: string,
    ssid: string,
    passphrase: string
  ): Promise<ESPProvisionStatus>;
  disconnect(deviceName: string): Promise<void>;
}

/**
 * Represents the status of the provisioning response.
 */
enum ESPProvResponseStatus {
  onProgress = "onProgress",
  succeed = "succeed",
}

/**
 * Represents the response received after provisioning.
 */
interface ESPProvResponse {
  status: ESPProvResponseStatus;
  description?: string;
}

export {
  ESPTransport,
  ESPSecurity,
  ESPProvisionStatus,
  ESPConnectStatus,
  ESPWifiList,
  ESPDeviceInterface,
  ESPProvisionAdapterInterface,
  ESPProvResponse,
  ESPProvResponseStatus,
};
