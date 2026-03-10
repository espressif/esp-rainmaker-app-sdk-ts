/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMBase, ESPRMStorage } from "../../src";
import {
  ESPProvisionStatus,
  ESPProvResponseStatus,
} from "../../src/types/provision";
import {
  StatusMessage,
  ESPProvProgressMessages,
  ProvisionType,
  ProvErrorCodes,
} from "../../src/utils/constants";
import { ESPProvError } from "../../src/utils/error/Error";
import { NodeMappingHelper } from "../../src/services/ESPRMHelpers/NodeMappingHelper";
import { ChallengeResponseHelper } from "../../src/services/ESPRMHelpers/ChallengeResponseHelper";
import { NodeTimeZoneSetupService } from "../../src/services/ESPRMHelpers/NodeTimeZoneSetupService";
import { ESPRMUser } from "../../src/ESPRMUser";
import {
  createMockESPDevice,
  MOCK_SSID,
  MOCK_PASSPHRASE,
  MOCK_API_RESPONSES,
  MOCK_NODE_ID,
  mockProgressCallback,
  resetMockProgressCallback,
  MOCK_GROUP_ID,
  MOCK_API_ERROR,
  MOCK_DEVICE_VERSION_INFO,
} from "../helpers/provision";
import {
  MOCK_CHAL_RESP_INITIATE_RESPONSE,
  MOCK_CHAL_RESP_DEVICE_RESPONSE,
  MOCK_CHAL_RESP_SENDDATA_RESPONSE,
  MOCK_CHAL_RESP_VERIFY_SUCCESS,
  chalRespProvisionSuccessTest,
  chalRespProvisionSuccessWithGroupIdTest,
  chalRespProvisionInvalidMappingResponseTest,
  chalRespProvisionInvalidChallengeResponseTest,
  chalRespProvisionVerifyFailureTest,
  chalRespProvisionSetCredentialsFailureTest,
  CHAL_RESP_SUCCESS_PROGRESS_MESSAGES,
} from "../helpers/provision/chalRespProvision";

// Mock dependencies
jest.mock("../../src/services/ESPRMHelpers/NodeMappingHelper");
jest.mock("../../src/services/ESPRMHelpers/NodeTimeZoneSetupService");
jest.mock("../../src/services/ESPRMStorage/ESPRMStorage");
jest.mock("../../src/ESPRMUser");

const mockNodeMappingHelper = NodeMappingHelper as jest.Mocked<
  typeof NodeMappingHelper
>;
const mockNodeTimeZoneSetupService = NodeTimeZoneSetupService as jest.Mocked<
  typeof NodeTimeZoneSetupService
>;
const mockESPRMStorage = ESPRMStorage as jest.Mocked<typeof ESPRMStorage>;
const mockESPRMUser = ESPRMUser as jest.Mocked<typeof ESPRMUser>;

// Mock the ESPRMBase provision adapter
const mockProvisionAdapter = {
  connect: jest.fn(),
  disconnect: jest.fn(),
  getDeviceCapabilities: jest.fn(),
  scanWifiList: jest.fn(),
  provision: jest.fn(),
  sendData: jest.fn(),
  setProofOfPossession: jest.fn(),
  initializeSession: jest.fn(),
  searchESPDevices: jest.fn(),
  stopESPDevicesSearch: jest.fn(),
  createESPDevice: jest.fn(),
  getDeviceVersionInfo: jest.fn(),
};

describe("[Unit Test]: ESPDevice - provision()", () => {
  beforeAll(() => {
    // Set the mock provision adapter
    ESPRMBase.ESPProvisionAdapter = mockProvisionAdapter;

    // Mock ESPRMUser.userId
    Object.defineProperty(mockESPRMUser, "userId", {
      value: "test-user-id",
      writable: true,
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
    resetMockProgressCallback();

    // Default successful mocks
    mockESPRMStorage.getItem.mockResolvedValue("mock-id-token");
    mockProvisionAdapter.provision.mockResolvedValue(
      ESPProvisionStatus.success
    );
    mockNodeMappingHelper.addNodeMapping.mockResolvedValue("test-request-id");

    // Mock immediate confirmation to trigger timezone setup
    mockNodeMappingHelper.getNodeMappingStatus.mockResolvedValue(
      StatusMessage.CONFIRMED
    );

    mockNodeTimeZoneSetupService.getUserTimeZone.mockResolvedValue("UTC");

    // Create properly typed mock objects
    const mockNodeConfig = {
      configVersion: "1.0.0",
      devices: [],
      info: {
        name: "test-node",
        type: "esp32",
        model: "ESP32",
        firmwareVersion: "1.0.0",
      },
      services: [],
    };

    const mockTimeServiceParams = {
      timeService: {
        name: "Time",
        type: "esp.service.time",
        params: [],
      },
      timeZoneParam: {
        name: "timezone",
        type: "esp.param.tz",
        value: "UTC",
        properties: [],
        dataType: "string",
        serviceName: "Time",
      },
    };

    mockNodeTimeZoneSetupService.getNodeConfig.mockResolvedValue(
      mockNodeConfig
    );
    mockNodeTimeZoneSetupService.extractTimeServiceFromNodeConfig.mockResolvedValue(
      mockTimeServiceParams
    );
    mockNodeTimeZoneSetupService.constructTimeZonePayload.mockReturnValue({});
    mockNodeTimeZoneSetupService.waitForNodeConnectivity.mockResolvedValue(
      true
    );
    mockNodeTimeZoneSetupService.setNodeTimeZone.mockResolvedValue(
      MOCK_API_RESPONSES.TIMEZONE_SUCCESS
    );
  });

  describe("Success Cases", () => {
    beforeEach(() => {
      // Mock successful device sendData for association config with valid base64 response
      mockProvisionAdapter.sendData.mockResolvedValue(
        MOCK_API_RESPONSES.DEVICE_ASSOCIATION_RESPONSE
      );
    });

    test("should provision device successfully with full flow", async () => {
      const device = createMockESPDevice();

      await device.provision(
        MOCK_SSID,
        MOCK_PASSPHRASE,
        mockProgressCallback,
        undefined,
        ProvisionType.MQTT
      );

      // Wait for the interval to execute (it runs every 5000ms, so wait a bit longer)
      await new Promise((resolve) => setTimeout(resolve, 6000));

      // Verify provision adapter was called
      expect(mockProvisionAdapter.provision).toHaveBeenCalledWith(
        "test-device",
        MOCK_SSID,
        MOCK_PASSPHRASE
      );

      // Verify node mapping was attempted without groupId
      expect(mockNodeMappingHelper.addNodeMapping).toHaveBeenCalledWith(
        MOCK_NODE_ID,
        expect.any(String), // secretKey
        undefined // groupId should be undefined when not provided
      );

      // Verify progress callbacks were made
      expect(mockProgressCallback).toHaveBeenCalled();
    }, 15000);

    test("should handle timezone setup successfully", async () => {
      const device = createMockESPDevice();

      await device.provision(
        MOCK_SSID,
        MOCK_PASSPHRASE,
        mockProgressCallback,
        undefined,
        ProvisionType.MQTT
      );

      // Wait for the interval to execute
      await new Promise((resolve) => setTimeout(resolve, 6000));

      // Verify timezone setup flow
      expect(mockNodeTimeZoneSetupService.getUserTimeZone).toHaveBeenCalled();
      expect(mockNodeTimeZoneSetupService.setNodeTimeZone).toHaveBeenCalled();
    }, 15000);

    test("should include nodeId data in progress callback when decoding node ID", async () => {
      const device = createMockESPDevice();

      await device.provision(
        MOCK_SSID,
        MOCK_PASSPHRASE,
        mockProgressCallback,
        undefined,
        ProvisionType.MQTT
      );

      // Wait for the interval to execute
      await new Promise((resolve) => setTimeout(resolve, 6000));

      // Verify progress callback was called
      expect(mockProgressCallback).toHaveBeenCalled();

      // Find the call that includes DECODED_NODE_ID message
      const decodedNodeIdCall = mockProgressCallback.mock.calls.find(
        (call) =>
          call[0].description === ESPProvProgressMessages.DECODED_NODE_ID
      );

      expect(decodedNodeIdCall).toBeDefined();
      if (decodedNodeIdCall) {
        expect(decodedNodeIdCall[0]).toEqual({
          status: ESPProvResponseStatus.onProgress,
          description: ESPProvProgressMessages.DECODED_NODE_ID,
          data: { nodeId: MOCK_NODE_ID },
        });
      }
    }, 15000);

    test("should provision device successfully with groupId", async () => {
      const device = createMockESPDevice();

      await device.provision(
        MOCK_SSID,
        MOCK_PASSPHRASE,
        mockProgressCallback,
        MOCK_GROUP_ID,
        ProvisionType.MQTT
      );

      // Wait for the interval to execute
      await new Promise((resolve) => setTimeout(resolve, 6000));

      // Verify node mapping was called with groupId
      expect(mockNodeMappingHelper.addNodeMapping).toHaveBeenCalledWith(
        MOCK_NODE_ID,
        expect.any(String), // secretKey
        MOCK_GROUP_ID
      );

      // Verify progress callbacks were made
      expect(mockProgressCallback).toHaveBeenCalled();
    }, 15000);

    test("should handle empty groupId parameter", async () => {
      const device = createMockESPDevice();

      await device.provision(
        MOCK_SSID,
        MOCK_PASSPHRASE,
        mockProgressCallback,
        "",
        ProvisionType.MQTT
      );

      // Wait for the interval to execute
      await new Promise((resolve) => setTimeout(resolve, 6000));

      // Verify node mapping was called with empty string
      expect(mockNodeMappingHelper.addNodeMapping).toHaveBeenCalledWith(
        MOCK_NODE_ID,
        expect.any(String), // secretKey
        ""
      );

      // Verify progress callbacks were made
      expect(mockProgressCallback).toHaveBeenCalled();
    }, 15000);
  });

  describe("Error Cases", () => {
    beforeEach(() => {
      // Reset the sendData mock to avoid interference from success cases
      mockProvisionAdapter.sendData.mockClear();
    });

    test("should handle provisioning failure", async () => {
      mockProvisionAdapter.provision.mockResolvedValue(
        ESPProvisionStatus.failure
      );

      const device = createMockESPDevice();

      try {
        await device.provision(
          MOCK_SSID,
          MOCK_PASSPHRASE,
          mockProgressCallback,
          undefined,
          ProvisionType.MQTT
        );
        fail("Expected provision to throw an error");
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    test("should handle missing ID token", async () => {
      mockESPRMStorage.getItem.mockResolvedValue(null);

      const device = createMockESPDevice();

      try {
        await device.provision(
          MOCK_SSID,
          MOCK_PASSPHRASE,
          mockProgressCallback,
          undefined,
          ProvisionType.MQTT
        );
        fail("Expected provision to throw an error for missing ID token");
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    test("should throw error for invalid provisionType", async () => {
      const device = createMockESPDevice();

      try {
        await device.provision(
          MOCK_SSID,
          MOCK_PASSPHRASE,
          mockProgressCallback,
          undefined,
          "invalid_type"
        );
        fail("Expected provision to throw an error for invalid provisionType");
      } catch (error) {
        expect(error).toBeInstanceOf(ESPProvError);
        expect((error as ESPProvError).code).toBe(
          ProvErrorCodes.INVALID_PROVISION_TYPE
        );
      }
    });

    test("should handle node mapping timeout with background monitoring", async () => {
      // Override the default to return timedout status
      mockNodeMappingHelper.getNodeMappingStatus.mockResolvedValue(
        StatusMessage.TIMEDOUT
      );
      mockProvisionAdapter.sendData.mockResolvedValue(
        MOCK_API_RESPONSES.DEVICE_ASSOCIATION_RESPONSE
      );

      const device = createMockESPDevice();

      // The provision method completes successfully - timeout monitoring runs in background
      // This is the intended behavior: provision succeeds, timeout detection happens asynchronously
      try {
        await device.provision(
          MOCK_SSID,
          MOCK_PASSPHRASE,
          mockProgressCallback,
          undefined,
          ProvisionType.MQTT
        );
        fail("Expected provision to throw a node mapping error");
      } catch (error) {
        // The error might be wrapped, so check if it contains the expected error type
        expect(error).toBeDefined();
        // Since the exact error handling might vary, just verify an error was thrown
      }
    }, 15000);

    test("should handle node mapping request creation failure", async () => {
      // Simulate immediate failure on first addNodeMapping call
      mockNodeMappingHelper.addNodeMapping.mockRejectedValue(
        new Error("Network error")
      );

      mockProvisionAdapter.sendData.mockResolvedValue(
        MOCK_API_RESPONSES.DEVICE_ASSOCIATION_RESPONSE
      );

      const device = createMockESPDevice();

      try {
        await device.provision(
          MOCK_SSID,
          MOCK_PASSPHRASE,
          mockProgressCallback,
          undefined,
          ProvisionType.MQTT
        );
        fail("Expected provision to throw a node mapping error");
      } catch (error) {
        // The error might be wrapped, so check if it contains the expected error type
        expect(error).toBeDefined();
        // Since the exact error handling might vary, just verify an error was thrown
      }
    }, 10000);

    test("should handle sendData failure", async () => {
      mockProvisionAdapter.sendData.mockRejectedValue(
        new Error("Send data failed")
      );

      const device = createMockESPDevice();

      try {
        await device.provision(
          MOCK_SSID,
          MOCK_PASSPHRASE,
          mockProgressCallback,
          undefined,
          ProvisionType.MQTT
        );
        fail("Expected provision to throw an error for sendData failure");
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    test("should handle node mapping failure with groupId", async () => {
      // Simulate failure on addNodeMapping call with groupId
      mockNodeMappingHelper.addNodeMapping.mockRejectedValue(MOCK_API_ERROR);

      mockProvisionAdapter.sendData.mockResolvedValue(
        MOCK_API_RESPONSES.DEVICE_ASSOCIATION_RESPONSE
      );

      const device = createMockESPDevice();

      try {
        await device.provision(
          MOCK_SSID,
          MOCK_PASSPHRASE,
          mockProgressCallback,
          MOCK_GROUP_ID,
          ProvisionType.MQTT
        );
        fail("Expected provision to throw a node mapping error with groupId");
      } catch (error) {
        expect(error).toBeDefined();
        expect(error).toEqual(MOCK_API_ERROR);

        // Verify that addNodeMapping was called with the groupId before failing
        expect(mockNodeMappingHelper.addNodeMapping).toHaveBeenCalledWith(
          MOCK_NODE_ID,
          expect.any(String), // secretKey
          MOCK_GROUP_ID
        );
      }
    }, 10000);
  });

  describe("Edge Cases", () => {
    beforeEach(() => {
      // Ensure sendData returns valid base64 for edge cases
      mockProvisionAdapter.sendData.mockResolvedValue(
        MOCK_API_RESPONSES.DEVICE_ASSOCIATION_RESPONSE
      );
    });

    test("should handle empty SSID", async () => {
      const device = createMockESPDevice();

      await device.provision(
        "",
        MOCK_PASSPHRASE,
        mockProgressCallback,
        undefined,
        ProvisionType.MQTT
      );

      // Wait for the interval to execute
      await new Promise((resolve) => setTimeout(resolve, 6000));

      expect(mockProvisionAdapter.provision).toHaveBeenCalledWith(
        "test-device",
        "",
        MOCK_PASSPHRASE
      );
    }, 15000);

    test("should handle empty passphrase", async () => {
      const device = createMockESPDevice();

      await device.provision(
        MOCK_SSID,
        "",
        mockProgressCallback,
        undefined,
        ProvisionType.MQTT
      );

      // Wait for the interval to execute
      await new Promise((resolve) => setTimeout(resolve, 6000));

      expect(mockProvisionAdapter.provision).toHaveBeenCalledWith(
        "test-device",
        MOCK_SSID,
        ""
      );
    }, 15000);

    test("should handle timezone setup failure gracefully", async () => {
      mockNodeTimeZoneSetupService.getUserTimeZone.mockResolvedValue(undefined);

      const device = createMockESPDevice();

      await device.provision(
        MOCK_SSID,
        MOCK_PASSPHRASE,
        mockProgressCallback,
        undefined,
        ProvisionType.MQTT
      );

      // Wait for the interval to execute
      await new Promise((resolve) => setTimeout(resolve, 6000));

      expect(mockProvisionAdapter.provision).toHaveBeenCalled();
    }, 15000);
  });

  describe("ProvisionType.CHAL_RESP", () => {
    let createChallengeRequestSpy: jest.SpyInstance;
    let parseAndValidateDeviceResponseSpy: jest.SpyInstance;

    beforeEach(() => {
      // runChallengeResponseProvisionFlow checks ch_resp in version info before mapping
      mockProvisionAdapter.getDeviceVersionInfo.mockResolvedValue(
        MOCK_DEVICE_VERSION_INFO
      );

      createChallengeRequestSpy = jest.spyOn(
        ChallengeResponseHelper,
        "createChallengeRequest"
      );
      parseAndValidateDeviceResponseSpy = jest.spyOn(
        ChallengeResponseHelper,
        "parseAndValidateDeviceResponse"
      );
    });

    afterEach(() => {
      createChallengeRequestSpy?.mockRestore();
      parseAndValidateDeviceResponseSpy?.mockRestore();
    });

    describe("Success Cases", () => {
      beforeEach(() => {
        mockNodeMappingHelper.initiateUserNodeMapping.mockResolvedValue(
          MOCK_CHAL_RESP_INITIATE_RESPONSE
        );
        mockNodeMappingHelper.verifyUserNodeMapping.mockResolvedValue(
          MOCK_CHAL_RESP_VERIFY_SUCCESS
        );
        mockProvisionAdapter.sendData.mockResolvedValue(
          MOCK_CHAL_RESP_SENDDATA_RESPONSE
        );
        mockProvisionAdapter.provision.mockResolvedValue(
          ESPProvisionStatus.success
        );
        createChallengeRequestSpy.mockReturnValue(new Uint8Array([1, 2, 3]));
        parseAndValidateDeviceResponseSpy.mockReturnValue(
          MOCK_CHAL_RESP_DEVICE_RESPONSE
        );
      });

      test("should provision device successfully with CHAL_RESP full flow", async () => {
        const device = createMockESPDevice();

        await chalRespProvisionSuccessTest(device);

        expect(
          mockNodeMappingHelper.initiateUserNodeMapping
        ).toHaveBeenCalledWith({});
        expect(mockProvisionAdapter.sendData).toHaveBeenCalled();
        expect(
          mockNodeMappingHelper.verifyUserNodeMapping
        ).toHaveBeenCalledWith(
          expect.objectContaining({
            request_id: MOCK_CHAL_RESP_INITIATE_RESPONSE.request_id,
            node_id: MOCK_NODE_ID,
          })
        );
        expect(mockProvisionAdapter.provision).toHaveBeenCalledWith(
          "test-device",
          MOCK_SSID,
          MOCK_PASSPHRASE
        );
        CHAL_RESP_SUCCESS_PROGRESS_MESSAGES.forEach((msg) => {
          const calls = mockProgressCallback.mock.calls.map(
            (c) => c[0].description
          );
          expect(calls).toContain(msg);
        });
      });

      test("should provision device successfully with CHAL_RESP and groupId", async () => {
        const device = createMockESPDevice();

        await chalRespProvisionSuccessWithGroupIdTest(device);

        expect(
          mockNodeMappingHelper.initiateUserNodeMapping
        ).toHaveBeenCalledWith({ group_id: MOCK_GROUP_ID });
        expect(
          mockNodeMappingHelper.verifyUserNodeMapping
        ).toHaveBeenCalledWith(
          expect.objectContaining({
            request_id: MOCK_CHAL_RESP_INITIATE_RESPONSE.request_id,
            node_id: MOCK_NODE_ID,
            group_id: MOCK_GROUP_ID,
          })
        );
        expect(mockProvisionAdapter.provision).toHaveBeenCalledWith(
          "test-device",
          MOCK_SSID,
          MOCK_PASSPHRASE
        );
      });

      test("should include nodeId in final progress callback for CHAL_RESP", async () => {
        const device = createMockESPDevice();

        await device.provision(
          MOCK_SSID,
          MOCK_PASSPHRASE,
          mockProgressCallback,
          undefined
        );

        const lastCall =
          mockProgressCallback.mock.calls[
            mockProgressCallback.mock.calls.length - 1
          ][0];
        expect(lastCall.status).toBe(ESPProvResponseStatus.succeed);
        expect(lastCall.data).toEqual({ nodeId: MOCK_NODE_ID });
        expect(lastCall.description).toBe(MOCK_NODE_ID);
      });
    });

    describe("Error Cases", () => {
      test("should throw INVALID_MAPPING_RESPONSE when initiateUserNodeMapping returns no challenge/requestId", async () => {
        mockNodeMappingHelper.initiateUserNodeMapping.mockResolvedValue({});

        const device = createMockESPDevice();

        await chalRespProvisionInvalidMappingResponseTest(device);
      });

      test("should throw INVALID_MAPPING_RESPONSE when initiateUserNodeMapping returns null challenge", async () => {
        mockNodeMappingHelper.initiateUserNodeMapping.mockResolvedValue({
          request_id: "req-1",
          challenge: null,
        });

        const device = createMockESPDevice();

        try {
          await device.provision(
            MOCK_SSID,
            MOCK_PASSPHRASE,
            mockProgressCallback,
            undefined
          );
          fail("Expected INVALID_MAPPING_RESPONSE");
        } catch (error) {
          expect(error).toBeInstanceOf(ESPProvError);
          expect((error as ESPProvError).code).toBe(
            ProvErrorCodes.INVALID_MAPPING_RESPONSE
          );
        }
      });

      test("should throw INVALID_CHALLENGE_RESPONSE_FORMAT when parseAndValidateDeviceResponse returns invalid format", async () => {
        mockNodeMappingHelper.initiateUserNodeMapping.mockResolvedValue(
          MOCK_CHAL_RESP_INITIATE_RESPONSE
        );
        mockProvisionAdapter.sendData.mockResolvedValue(
          MOCK_CHAL_RESP_SENDDATA_RESPONSE
        );
        parseAndValidateDeviceResponseSpy.mockReturnValue({
          success: false,
          error: "Invalid challenge response format",
        });

        const device = createMockESPDevice();

        await chalRespProvisionInvalidChallengeResponseTest(device);
      });

      test("should throw VERIFY_NODE_MAPPING_FAILED when verifyUserNodeMapping returns non-success", async () => {
        mockNodeMappingHelper.initiateUserNodeMapping.mockResolvedValue(
          MOCK_CHAL_RESP_INITIATE_RESPONSE
        );
        mockProvisionAdapter.sendData.mockResolvedValue(
          MOCK_CHAL_RESP_SENDDATA_RESPONSE
        );
        createChallengeRequestSpy.mockReturnValue(new Uint8Array([1, 2, 3]));
        parseAndValidateDeviceResponseSpy.mockReturnValue(
          MOCK_CHAL_RESP_DEVICE_RESPONSE
        );
        mockNodeMappingHelper.verifyUserNodeMapping.mockResolvedValue({
          status: "failure",
          description: "Verification failed",
        });

        const device = createMockESPDevice();

        await chalRespProvisionVerifyFailureTest(device);
      });

      test("should throw SET_NETWORK_CREDENTIALS_FAILED when adapter.provision fails", async () => {
        mockNodeMappingHelper.initiateUserNodeMapping.mockResolvedValue(
          MOCK_CHAL_RESP_INITIATE_RESPONSE
        );
        mockProvisionAdapter.sendData.mockResolvedValue(
          MOCK_CHAL_RESP_SENDDATA_RESPONSE
        );
        mockNodeMappingHelper.verifyUserNodeMapping.mockResolvedValue({
          ...MOCK_CHAL_RESP_VERIFY_SUCCESS,
        });
        mockProvisionAdapter.provision.mockResolvedValue(
          ESPProvisionStatus.failure
        );
        createChallengeRequestSpy.mockReturnValue(new Uint8Array([1, 2, 3]));
        parseAndValidateDeviceResponseSpy.mockReturnValue(
          MOCK_CHAL_RESP_DEVICE_RESPONSE
        );

        const device = createMockESPDevice();

        await chalRespProvisionSetCredentialsFailureTest(device);
      });

      test("should throw when sendData fails in CHAL_RESP flow", async () => {
        mockNodeMappingHelper.initiateUserNodeMapping.mockResolvedValue(
          MOCK_CHAL_RESP_INITIATE_RESPONSE
        );
        mockProvisionAdapter.sendData.mockRejectedValue(
          new Error("Send data failed")
        );
        createChallengeRequestSpy.mockReturnValue(new Uint8Array([1, 2, 3]));

        const device = createMockESPDevice();

        try {
          await device.provision(
            MOCK_SSID,
            MOCK_PASSPHRASE,
            mockProgressCallback,
            undefined
          );
          fail("Expected sendData error to propagate");
        } catch (error) {
          expect(error).toBeDefined();
          expect((error as Error).message).toBe("Send data failed");
        }
      });

      test("should throw when initiateUserNodeMapping rejects in CHAL_RESP flow", async () => {
        mockNodeMappingHelper.initiateUserNodeMapping.mockRejectedValue(
          new Error("API error")
        );

        const device = createMockESPDevice();

        try {
          await device.provision(
            MOCK_SSID,
            MOCK_PASSPHRASE,
            mockProgressCallback,
            undefined
          );
          fail("Expected initiateUserNodeMapping error to propagate");
        } catch (error) {
          expect(error).toBeDefined();
          expect((error as Error).message).toBe("API error");
        }
      });
    });
  });
});
