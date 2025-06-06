/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMBase } from "../../src";
import {
  createMockESPDevice,
  MOCK_ENDPOINT,
  MOCK_DATA,
  MOCK_API_RESPONSES,
  sendDataSuccessTest,
  sendDataWithCustomParamsTest,
  sendDataFailureTest,
  sendDataEmptyTest,
  sendDataEmptyEndpointTest,
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

describe("[Unit Test]: ESPDevice - sendData()", () => {
  beforeAll(() => {
    // Set the mock provision adapter
    ESPRMBase.ESPProvisionAdapter = mockProvisionAdapter;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Success Cases", () => {
    beforeEach(() => {
      mockProvisionAdapter.sendData.mockResolvedValue(
        MOCK_API_RESPONSES.PROVISION_ADAPTER_RESPONSE
      );
    });

    test("should send data successfully", async () => {
      const device = createMockESPDevice();
      await sendDataSuccessTest(device, MOCK_ENDPOINT, MOCK_DATA);

      expect(mockProvisionAdapter.sendData).toHaveBeenCalledWith(
        "test-device",
        MOCK_ENDPOINT,
        MOCK_DATA
      );
      expect(mockProvisionAdapter.sendData).toHaveBeenCalledTimes(1);
    });

    test("should send data with custom endpoint and data", async () => {
      const device = createMockESPDevice();
      const customEndpoint = "custom/endpoint";
      const customData = "custom-data-payload";
      const expectedResponse = "custom-response";

      mockProvisionAdapter.sendData.mockResolvedValue(expectedResponse);

      await sendDataWithCustomParamsTest(
        device,
        customEndpoint,
        customData,
        expectedResponse
      );

      expect(mockProvisionAdapter.sendData).toHaveBeenCalledWith(
        "test-device",
        customEndpoint,
        customData
      );
    });

    test("should handle different device names", async () => {
      const device = createMockESPDevice({ name: "custom-device" });
      await sendDataSuccessTest(device, MOCK_ENDPOINT, MOCK_DATA);

      expect(mockProvisionAdapter.sendData).toHaveBeenCalledWith(
        "custom-device",
        MOCK_ENDPOINT,
        MOCK_DATA
      );
    });

    test("should handle empty data", async () => {
      const device = createMockESPDevice();
      mockProvisionAdapter.sendData.mockResolvedValue("");

      await sendDataEmptyTest(device);

      expect(mockProvisionAdapter.sendData).toHaveBeenCalledWith(
        "test-device",
        MOCK_ENDPOINT,
        ""
      );
    });

    test("should handle empty endpoint", async () => {
      const device = createMockESPDevice();
      mockProvisionAdapter.sendData.mockResolvedValue("");

      await sendDataEmptyEndpointTest(device);

      expect(mockProvisionAdapter.sendData).toHaveBeenCalledWith(
        "test-device",
        "",
        MOCK_DATA
      );
    });
  });

  describe("Error Cases", () => {
    beforeEach(() => {
      mockProvisionAdapter.sendData.mockRejectedValue(
        new Error("Send data failed")
      );
    });

    test("should handle data sending failure", async () => {
      const device = createMockESPDevice();
      await sendDataFailureTest(device);

      expect(mockProvisionAdapter.sendData).toHaveBeenCalledWith(
        "test-device",
        MOCK_ENDPOINT,
        MOCK_DATA
      );
    });

    test("should propagate network errors", async () => {
      const device = createMockESPDevice();
      const expectedError = new Error("Network timeout");
      mockProvisionAdapter.sendData.mockRejectedValue(expectedError);

      try {
        await device.sendData(MOCK_ENDPOINT, MOCK_DATA);
        fail("Expected sendData to throw an error");
      } catch (error) {
        expect(error).toBe(expectedError);
      }
    });

    test("should handle device communication errors", async () => {
      const device = createMockESPDevice();
      const expectedError = new Error("Device not responding");
      mockProvisionAdapter.sendData.mockRejectedValue(expectedError);

      try {
        await device.sendData("test/endpoint", "test-data");
        fail("Expected sendData to throw an error");
      } catch (error) {
        expect(error).toBe(expectedError);
      }
    });

    test("should handle invalid endpoint errors", async () => {
      const device = createMockESPDevice();
      const expectedError = new Error("Invalid endpoint");
      mockProvisionAdapter.sendData.mockRejectedValue(expectedError);

      try {
        await device.sendData("invalid-endpoint", MOCK_DATA);
        fail("Expected sendData to throw an error");
      } catch (error) {
        expect(error).toBe(expectedError);
      }
    });
  });

  describe("Data Format Cases", () => {
    test("should handle JSON data", async () => {
      const device = createMockESPDevice();
      const jsonData = JSON.stringify({ key: "value", number: 123 });
      const expectedResponse = "json-response";

      mockProvisionAdapter.sendData.mockResolvedValue(expectedResponse);

      const result = await device.sendData("json/endpoint", jsonData);
      expect(result).toBe(expectedResponse);
      expect(mockProvisionAdapter.sendData).toHaveBeenCalledWith(
        "test-device",
        "json/endpoint",
        jsonData
      );
    });

    test("should handle binary data as string", async () => {
      const device = createMockESPDevice();
      const binaryData = "binary-data-as-string";
      const expectedResponse = "binary-response";

      mockProvisionAdapter.sendData.mockResolvedValue(expectedResponse);

      const result = await device.sendData("binary/endpoint", binaryData);
      expect(result).toBe(expectedResponse);
      expect(mockProvisionAdapter.sendData).toHaveBeenCalledWith(
        "test-device",
        "binary/endpoint",
        binaryData
      );
    });

    test("should handle large data payloads", async () => {
      const device = createMockESPDevice();
      const largeData = "x".repeat(10000);
      const expectedResponse = "large-data-response";

      mockProvisionAdapter.sendData.mockResolvedValue(expectedResponse);

      const result = await device.sendData("large/endpoint", largeData);
      expect(result).toBe(expectedResponse);
      expect(mockProvisionAdapter.sendData).toHaveBeenCalledWith(
        "test-device",
        "large/endpoint",
        largeData
      );
    });
  });

  describe("Endpoint Variations", () => {
    test("should handle path-style endpoints", async () => {
      const device = createMockESPDevice();
      const pathEndpoint = "api/v1/device/control";
      mockProvisionAdapter.sendData.mockResolvedValue("path-response");

      const result = await device.sendData(pathEndpoint, MOCK_DATA);
      expect(result).toBe("path-response");
      expect(mockProvisionAdapter.sendData).toHaveBeenCalledWith(
        "test-device",
        pathEndpoint,
        MOCK_DATA
      );
    });

    test("should handle query parameter endpoints", async () => {
      const device = createMockESPDevice();
      const queryEndpoint = "endpoint?param1=value1&param2=value2";
      mockProvisionAdapter.sendData.mockResolvedValue("query-response");

      const result = await device.sendData(queryEndpoint, MOCK_DATA);
      expect(result).toBe("query-response");
      expect(mockProvisionAdapter.sendData).toHaveBeenCalledWith(
        "test-device",
        queryEndpoint,
        MOCK_DATA
      );
    });
  });
});
