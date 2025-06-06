/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMBase } from "../../src";
import {
  createMockESPDevice,
  MOCK_DEVICE_CAPABILITIES,
  getDeviceCapabilitiesSuccessTest,
  getDeviceCapabilitiesWithExpectedResultsTest,
  getDeviceCapabilitiesFailureTest,
  getDeviceCapabilitiesEmptyTest,
  getDeviceCapabilitiesContainsTest,
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

describe("[Unit Test]: ESPDevice - getDeviceCapabilities()", () => {
  beforeAll(() => {
    // Set the mock provision adapter
    ESPRMBase.ESPProvisionAdapter = mockProvisionAdapter;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Success Cases", () => {
    beforeEach(() => {
      mockProvisionAdapter.getDeviceCapabilities.mockResolvedValue(
        MOCK_DEVICE_CAPABILITIES
      );
    });

    test("should get device capabilities successfully", async () => {
      const device = createMockESPDevice();
      await getDeviceCapabilitiesSuccessTest(device);

      expect(mockProvisionAdapter.getDeviceCapabilities).toHaveBeenCalledWith(
        "test-device"
      );
      expect(mockProvisionAdapter.getDeviceCapabilities).toHaveBeenCalledTimes(
        1
      );
    });

    test("should return expected capabilities", async () => {
      const device = createMockESPDevice();
      await getDeviceCapabilitiesWithExpectedResultsTest(
        device,
        MOCK_DEVICE_CAPABILITIES
      );
    });

    test("should check for specific capability", async () => {
      const device = createMockESPDevice();
      await getDeviceCapabilitiesContainsTest(device, "wifi_scan");
    });

    test("should get capabilities with custom device name", async () => {
      const device = createMockESPDevice({ name: "custom-device" });
      await getDeviceCapabilitiesSuccessTest(device);

      expect(mockProvisionAdapter.getDeviceCapabilities).toHaveBeenCalledWith(
        "custom-device"
      );
    });
  });

  describe("Empty Results", () => {
    beforeEach(() => {
      mockProvisionAdapter.getDeviceCapabilities.mockResolvedValue([]);
    });

    test("should handle empty capabilities", async () => {
      const device = createMockESPDevice();
      await getDeviceCapabilitiesEmptyTest(device);

      expect(mockProvisionAdapter.getDeviceCapabilities).toHaveBeenCalledWith(
        "test-device"
      );
    });
  });

  describe("Error Cases", () => {
    beforeEach(() => {
      mockProvisionAdapter.getDeviceCapabilities.mockRejectedValue(
        new Error("Failed to get capabilities")
      );
    });

    test("should handle capabilities retrieval failure", async () => {
      const device = createMockESPDevice();
      await getDeviceCapabilitiesFailureTest(device);

      expect(mockProvisionAdapter.getDeviceCapabilities).toHaveBeenCalledWith(
        "test-device"
      );
    });

    test("should propagate capabilities error", async () => {
      const device = createMockESPDevice();
      const expectedError = new Error("Device not responding");
      mockProvisionAdapter.getDeviceCapabilities.mockRejectedValue(
        expectedError
      );

      try {
        await device.getDeviceCapabilities();
        fail("Expected getDeviceCapabilities to throw an error");
      } catch (error) {
        expect(error).toBe(expectedError);
      }
    });
  });
});
