/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPDevice } from "../../../src/ESPDevice";
import {
  ESPDeviceInterface,
  ESPProvResponse,
  ESPProvResponseStatus,
  ESPWifiList,
} from "../../../src/types/provision";
import { ESPAPIResponse, StatusMessage } from "../../../src";
import { ESPProvProgressMessages } from "../../../src/utils/constants";
import { rainmaker } from "../../../src/proto/esp_rmaker_user_mapping";
import { uint8ArrayToBase64 } from "../../../src/services/ESPRMHelpers/TransformEncoding";
import { parseAPIErrorResponse } from "../../../src/utils/error/parser";

// Mock device configuration
export const MOCK_DEVICE_CONFIG: ESPDeviceInterface = {
  name: "test-device",
  transport: "ble",
  security: 1,
};

export const MOCK_DEVICE_NAME = "test-device";
export const MOCK_SSID = "TestWiFi";
export const MOCK_PASSPHRASE = "password123";
export const MOCK_SECRET_KEY = "test-secret-key";
export const MOCK_NODE_ID = "test-node-id";
export const MOCK_REQUEST_ID = "test-request-id";
export const MOCK_GROUP_ID = "test-group-id";

/**
 * Creates a valid base64-encoded protobuf response for device association
 */
function createMockDeviceAssociationResponse(
  nodeId: string = MOCK_NODE_ID
): string {
  const response = new rainmaker.RMakerConfigPayload();
  response.msg = rainmaker.RMakerConfigMsgType.TypeRespSetUserMapping;

  const respSetUserMapping = new rainmaker.RespSetUserMapping();
  respSetUserMapping.Status = rainmaker.RMakerConfigStatus.Success;
  respSetUserMapping.NodeId = nodeId;

  response.resp_set_user_mapping = respSetUserMapping;

  const serializedResponse = response.serialize();
  return uint8ArrayToBase64(serializedResponse);
}

// Mock device capabilities
export const MOCK_DEVICE_CAPABILITIES = ["wifi_scan", "wifi_prov"];

// Mock WiFi list
export const MOCK_WIFI_LIST: ESPWifiList[] = [
  {
    ssid: "TestWiFi1",
    rssi: -45,
    auth: 1,
  },
  {
    ssid: "TestWiFi2",
    rssi: -60,
    auth: 2,
  },
];

// Mock provision responses
export const MOCK_PROV_RESPONSES = {
  CONNECT_SUCCESS: {
    status: ESPProvResponseStatus.succeed,
    description: "Connected successfully",
  } as ESPProvResponse,

  CONNECT_FAILED: {
    status: ESPProvResponseStatus.onProgress,
    description: "Connection failed",
  } as ESPProvResponse,

  START_ASSOCIATION: {
    status: ESPProvResponseStatus.onProgress,
    description: ESPProvProgressMessages.START_ASSOCIATION,
  } as ESPProvResponse,

  ASSOCIATION_CONFIG_CREATED: {
    status: ESPProvResponseStatus.onProgress,
    description: ESPProvProgressMessages.ASSOCIATION_CONFIG_CREATED,
  } as ESPProvResponse,

  SENDING_ASSOCIATION_CONFIG: {
    status: ESPProvResponseStatus.onProgress,
    description: ESPProvProgressMessages.SENDING_ASSOCIATION_CONFIG,
  } as ESPProvResponse,

  ASSOCIATION_CONFIG_SENT: {
    status: ESPProvResponseStatus.onProgress,
    description: ESPProvProgressMessages.ASSOCIATION_CONFIG_SENT,
  } as ESPProvResponse,

  DEVICE_PROVISIONED: {
    status: ESPProvResponseStatus.succeed,
    description: ESPProvProgressMessages.DEVICE_PROVISIONED,
  } as ESPProvResponse,

  NODE_TIMEZONE_SETUP_SUCCEED: {
    status: ESPProvResponseStatus.succeed,
    description: ESPProvProgressMessages.NODE_TIMEZONE_SETUP_SUCCEED,
  } as ESPProvResponse,
} as const;

// Mock API responses
export const MOCK_API_RESPONSES = {
  NODE_MAPPING_SUCCESS: {
    request_id: MOCK_REQUEST_ID,
  },

  NODE_MAPPING_STATUS_CONFIRMED: {
    request_status: StatusMessage.CONFIRMED,
  },

  NODE_MAPPING_STATUS_TIMEDOUT: {
    request_status: StatusMessage.TIMEDOUT,
  },

  NODE_MAPPING_VERIFICATION_SUCCESS: {
    status: StatusMessage.SUCCESS,
    description: "User node mapping verified successfully",
  } as ESPAPIResponse,

  TIMEZONE_SUCCESS: {
    status: StatusMessage.SUCCESS,
    description: "Timezone set successfully",
  } as ESPAPIResponse,

  // Valid base64 encoded response for device association
  PROVISION_ADAPTER_RESPONSE: "dGVzdC1yZXNwb25zZS1kYXRh", // base64 for "test-response-data"

  // Valid base64 encoded device association response (mock protobuf structure)
  get DEVICE_ASSOCIATION_RESPONSE() {
    return createMockDeviceAssociationResponse();
  },
} as const;

// Mock proof of possession
export const MOCK_PROOF_OF_POSSESSION = "test-pop";

// Mock endpoint data
export const MOCK_ENDPOINT = "test-endpoint";
export const MOCK_DATA = "test-data";

/**
 * Creates a mock ESPDevice instance for testing
 */
export function createMockESPDevice(
  config: Partial<ESPDeviceInterface> = {}
): ESPDevice {
  const deviceConfig: ESPDeviceInterface = {
    ...MOCK_DEVICE_CONFIG,
    ...config,
  };
  return new ESPDevice(deviceConfig);
}

/**
 * Mock progress callback for testing provision method
 */
export const mockProgressCallback = jest.fn((_message: ESPProvResponse) => {
  // Mock implementation - parameter intentionally unused
});

/**
 * Reset mock progress callback
 */
export function resetMockProgressCallback() {
  mockProgressCallback.mockClear();
}

/**
 * Verify provision progress callbacks were called with expected messages
 */
export function verifyProvisionProgressCalls(expectedCalls: ESPProvResponse[]) {
  expect(mockProgressCallback).toHaveBeenCalledTimes(expectedCalls.length);
  expectedCalls.forEach((expectedCall, index) => {
    expect(mockProgressCallback).toHaveBeenNthCalledWith(
      index + 1,
      expectedCall
    );
  });
}

/**
 * Mock device version info for testing
 */
export const MOCK_DEVICE_VERSION_INFO = {
  rmaker: {
    cap: MOCK_DEVICE_CAPABILITIES,
  },
  rmaker_extra: {
    cap: [...MOCK_DEVICE_CAPABILITIES, "ch_resp"],
  },
  ver: "1.0.0",
};

/**
 * Mock ESP devices list for search results
 */
export const MOCK_ESP_DEVICES: ESPDeviceInterface[] = [
  {
    name: "PROV_123456",
    transport: "ble",
    security: 1,
  },
  {
    name: "PROV_789012",
    transport: "ble",
    security: 1,
  },
];

/**
 * Mock device prefix for search
 */
export const MOCK_DEVICE_PREFIX = "PROV_";

/**
 * Mock transport type
 */
export const MOCK_TRANSPORT = "ble";

/**
 * Mock tokens for ESPRMUser constructor
 */
export const MOCK_USER_TOKENS = {
  accessToken: "mock-access-token",
  idToken:
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjdXN0b206dXNlcl9pZCI6InRlc3QtdXNlci1pZCIsImV4cCI6OTk5OTk5OTk5OX0._mock_signature",
  refreshToken: "mock-refresh-token",
};

/**
 * Mock API error response
 */
export const MOCK_API_ERROR_RESPONSE = {
  status: "failure",
  error_code: 103035,
  description:
    "User Node Mapping is successful, but adding a node to a group failed",
};

// Parse it the same way ESPRMAPIManager.request would
export const MOCK_API_ERROR = parseAPIErrorResponse(
  MOCK_API_ERROR_RESPONSE,
  400
);
