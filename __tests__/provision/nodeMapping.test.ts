/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMBase } from "../../src";
import { ESPRMAPIManager } from "../../src/services/ESPRMAPIManager";
import {
  createMockESPDevice,
  MOCK_API_RESPONSES,
  initiateUserNodeMappingSuccessTest,
  initiateUserNodeMappingWithCustomBodyTest,
  initiateUserNodeMappingFailureTest,
  verifyUserNodeMappingSuccessTest,
  verifyUserNodeMappingWithCustomBodyTest,
  verifyUserNodeMappingFailureTest,
  verifyUserNodeMappingWithExpectedResponseTest,
} from "../helpers/provision";

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

describe("[Unit Test]: ESPDevice - Node Mapping Methods", () => {
  let mockAuthorizeRequest: jest.SpyInstance;

  beforeAll(() => {
    // Set the mock provision adapter
    ESPRMBase.ESPProvisionAdapter = mockProvisionAdapter;

    // Mock the authorizeRequest method
    mockAuthorizeRequest = jest.spyOn(ESPRMAPIManager, "authorizeRequest");
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("initiateUserNodeMapping()", () => {
    describe("Success Cases", () => {
      beforeEach(() => {
        mockAuthorizeRequest.mockResolvedValue(
          MOCK_API_RESPONSES.NODE_MAPPING_SUCCESS
        );
      });

      test("should initiate user node mapping successfully", async () => {
        const device = createMockESPDevice();
        await initiateUserNodeMappingSuccessTest(device);

        expect(mockAuthorizeRequest).toHaveBeenCalledWith({
          method: "POST",
          url: expect.any(String),
          data: {},
        });
        expect(mockAuthorizeRequest).toHaveBeenCalledTimes(1);
      });

      test("should initiate user node mapping with custom request body", async () => {
        const device = createMockESPDevice();
        const customRequestBody = {
          nodeId: "test-node",
          secretKey: "test-secret",
        };

        await initiateUserNodeMappingWithCustomBodyTest(
          device,
          customRequestBody,
          MOCK_API_RESPONSES.NODE_MAPPING_SUCCESS
        );

        expect(mockAuthorizeRequest).toHaveBeenCalledWith({
          method: "POST",
          url: expect.any(String),
          data: customRequestBody,
        });
      });

      test("should handle empty request body", async () => {
        const device = createMockESPDevice();
        const result = await device.initiateUserNodeMapping();

        expect(result).toEqual(MOCK_API_RESPONSES.NODE_MAPPING_SUCCESS);
        expect(mockAuthorizeRequest).toHaveBeenCalledWith({
          method: "POST",
          url: expect.any(String),
          data: {},
        });
      });
    });

    describe("Error Cases", () => {
      beforeEach(() => {
        mockAuthorizeRequest.mockRejectedValue(
          new Error("Node mapping initiation failed")
        );
      });

      test("should handle initiation failure", async () => {
        const device = createMockESPDevice();
        await initiateUserNodeMappingFailureTest(device);

        expect(mockAuthorizeRequest).toHaveBeenCalledWith({
          method: "POST",
          url: expect.any(String),
          data: {},
        });
      });

      test("should propagate specific errors", async () => {
        const device = createMockESPDevice();
        const expectedError = new Error("Authentication failed");
        mockAuthorizeRequest.mockRejectedValue(expectedError);

        try {
          await device.initiateUserNodeMapping();
          fail("Expected initiateUserNodeMapping to throw an error");
        } catch (error) {
          expect(error).toBe(expectedError);
        }
      });
    });
  });

  describe("verifyUserNodeMapping()", () => {
    describe("Success Cases", () => {
      beforeEach(() => {
        mockAuthorizeRequest.mockResolvedValue(
          MOCK_API_RESPONSES.NODE_MAPPING_VERIFICATION_SUCCESS
        );
      });

      test("should verify user node mapping successfully", async () => {
        const device = createMockESPDevice();
        await verifyUserNodeMappingSuccessTest(device);

        expect(mockAuthorizeRequest).toHaveBeenCalledWith({
          method: "POST",
          url: expect.any(String),
          data: {},
        });
        expect(mockAuthorizeRequest).toHaveBeenCalledTimes(1);
      });

      test("should verify user node mapping with custom request body", async () => {
        const device = createMockESPDevice();
        const customRequestBody = {
          requestId: "test-request-id",
          verificationCode: "123456",
        };

        await verifyUserNodeMappingWithCustomBodyTest(
          device,
          customRequestBody,
          MOCK_API_RESPONSES.NODE_MAPPING_VERIFICATION_SUCCESS
        );

        expect(mockAuthorizeRequest).toHaveBeenCalledWith({
          method: "POST",
          url: expect.any(String),
          data: customRequestBody,
        });
      });

      test("should return expected API response structure", async () => {
        const device = createMockESPDevice();
        await verifyUserNodeMappingWithExpectedResponseTest(
          device,
          MOCK_API_RESPONSES.NODE_MAPPING_VERIFICATION_SUCCESS
        );
      });

      test("should handle empty request body for verification", async () => {
        const device = createMockESPDevice();
        const result = await device.verifyUserNodeMapping();

        expect(result).toEqual(
          MOCK_API_RESPONSES.NODE_MAPPING_VERIFICATION_SUCCESS
        );
        expect(mockAuthorizeRequest).toHaveBeenCalledWith({
          method: "POST",
          url: expect.any(String),
          data: {},
        });
      });
    });

    describe("Error Cases", () => {
      beforeEach(() => {
        mockAuthorizeRequest.mockRejectedValue(
          new Error("Node mapping verification failed")
        );
      });

      test("should handle verification failure", async () => {
        const device = createMockESPDevice();
        await verifyUserNodeMappingFailureTest(device);

        expect(mockAuthorizeRequest).toHaveBeenCalledWith({
          method: "POST",
          url: expect.any(String),
          data: {},
        });
      });

      test("should propagate verification errors", async () => {
        const device = createMockESPDevice();
        const expectedError = new Error("Invalid verification code");
        mockAuthorizeRequest.mockRejectedValue(expectedError);

        try {
          await device.verifyUserNodeMapping();
          fail("Expected verifyUserNodeMapping to throw an error");
        } catch (error) {
          expect(error).toBe(expectedError);
        }
      });
    });
  });

  describe("Integration Scenarios", () => {
    test("should handle initiate followed by verify flow", async () => {
      const device = createMockESPDevice();

      // Setup mocks for both operations
      mockAuthorizeRequest
        .mockResolvedValueOnce(MOCK_API_RESPONSES.NODE_MAPPING_SUCCESS)
        .mockResolvedValueOnce(
          MOCK_API_RESPONSES.NODE_MAPPING_VERIFICATION_SUCCESS
        );

      // Test initiate
      const initiateResult = await device.initiateUserNodeMapping();
      expect(initiateResult).toEqual(MOCK_API_RESPONSES.NODE_MAPPING_SUCCESS);

      // Test verify
      const verifyResult = await device.verifyUserNodeMapping({
        requestId: "test-request-id",
      });
      expect(verifyResult).toEqual(
        MOCK_API_RESPONSES.NODE_MAPPING_VERIFICATION_SUCCESS
      );

      // Verify both API calls were made
      expect(mockAuthorizeRequest).toHaveBeenCalledTimes(2);
      expect(mockAuthorizeRequest).toHaveBeenNthCalledWith(1, {
        method: "POST",
        url: expect.any(String),
        data: {},
      });
      expect(mockAuthorizeRequest).toHaveBeenNthCalledWith(2, {
        method: "POST",
        url: expect.any(String),
        data: { requestId: "test-request-id" },
      });
    });
  });
});
