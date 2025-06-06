/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMBase } from "../../src";
import {
  createMockESPDevice,
  MOCK_DEVICE_VERSION_INFO,
  getDeviceVersionInfoSuccessTest,
  getDeviceVersionInfoWithExpectedResultsTest,
  getDeviceVersionInfoFailureTest,
  getDeviceVersionInfoEmptyTest,
  getDeviceVersionInfoContainsKeysTest,
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

describe("[Unit Test]: ESPDevice - getDeviceVersionInfo()", () => {
  beforeAll(() => {
    // Set the mock provision adapter
    ESPRMBase.ESPProvisionAdapter = mockProvisionAdapter;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Success Cases", () => {
    beforeEach(() => {
      mockProvisionAdapter.getDeviceVersionInfo.mockResolvedValue(
        MOCK_DEVICE_VERSION_INFO
      );
    });

    test("should get device version info successfully", async () => {
      const device = createMockESPDevice();
      await getDeviceVersionInfoSuccessTest(device);

      expect(mockProvisionAdapter.getDeviceVersionInfo).toHaveBeenCalledWith(
        "test-device"
      );
      expect(mockProvisionAdapter.getDeviceVersionInfo).toHaveBeenCalledTimes(
        1
      );
    });

    test("should return expected version info", async () => {
      const device = createMockESPDevice();
      await getDeviceVersionInfoWithExpectedResultsTest(
        device,
        MOCK_DEVICE_VERSION_INFO
      );
    });

    test("should get version info with custom device name", async () => {
      const device = createMockESPDevice({ name: "custom-device" });
      await getDeviceVersionInfoSuccessTest(device);

      expect(mockProvisionAdapter.getDeviceVersionInfo).toHaveBeenCalledWith(
        "custom-device"
      );
    });

    test("should return version info with expected keys", async () => {
      const device = createMockESPDevice();
      await getDeviceVersionInfoContainsKeysTest(device, [
        "rmaker",
        "rmaker_extra",
        "ver",
      ]);
    });

    test("should handle direct method call", async () => {
      const device = createMockESPDevice();
      const versionInfo = await device.getDeviceVersionInfo();

      expect(versionInfo).toEqual(MOCK_DEVICE_VERSION_INFO);
      expect(mockProvisionAdapter.getDeviceVersionInfo).toHaveBeenCalledWith(
        "test-device"
      );
    });
  });

  describe("Empty/Null Cases", () => {
    beforeEach(() => {
      mockProvisionAdapter.getDeviceVersionInfo.mockResolvedValue({});
    });

    test("should handle empty version info", async () => {
      const device = createMockESPDevice();
      await getDeviceVersionInfoEmptyTest(device);

      expect(mockProvisionAdapter.getDeviceVersionInfo).toHaveBeenCalledWith(
        "test-device"
      );
    });
  });

  describe("Failure Cases", () => {
    beforeEach(() => {
      mockProvisionAdapter.getDeviceVersionInfo.mockRejectedValue(
        new Error("Failed to get device version info")
      );
    });

    test("should handle adapter failure", async () => {
      const device = createMockESPDevice();
      await getDeviceVersionInfoFailureTest(device);

      expect(mockProvisionAdapter.getDeviceVersionInfo).toHaveBeenCalledWith(
        "test-device"
      );
    });

    test("should propagate adapter errors", async () => {
      const device = createMockESPDevice();
      const errorMessage = "Version info not available";
      mockProvisionAdapter.getDeviceVersionInfo.mockRejectedValue(
        new Error(errorMessage)
      );

      try {
        await device.getDeviceVersionInfo();
        fail("Expected getDeviceVersionInfo to throw an error");
      } catch (error: any) {
        expect(error.message).toBe(errorMessage);
      }
    });
  });
});
