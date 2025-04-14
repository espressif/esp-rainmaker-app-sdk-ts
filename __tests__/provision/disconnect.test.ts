/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMBase } from "../../src";
import {
  createMockESPDevice,
  disconnectDeviceSuccessTest,
  disconnectDeviceFailureTest,
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

describe("[Unit Test]: ESPDevice - disconnect()", () => {
  beforeAll(() => {
    // Set the mock provision adapter
    ESPRMBase.ESPProvisionAdapter = mockProvisionAdapter;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Success Cases", () => {
    beforeEach(() => {
      mockProvisionAdapter.disconnect.mockResolvedValue(undefined);
    });

    test("should disconnect device successfully", async () => {
      const device = createMockESPDevice();
      await disconnectDeviceSuccessTest(device);

      expect(mockProvisionAdapter.disconnect).toHaveBeenCalledWith(
        "test-device"
      );
      expect(mockProvisionAdapter.disconnect).toHaveBeenCalledTimes(1);
    });

    test("should disconnect with custom device name", async () => {
      const device = createMockESPDevice({ name: "custom-device" });
      await disconnectDeviceSuccessTest(device);

      expect(mockProvisionAdapter.disconnect).toHaveBeenCalledWith(
        "custom-device"
      );
    });

    test("should handle void return value correctly", async () => {
      const device = createMockESPDevice();
      const result = await device.disconnect();

      expect(result).toBeUndefined();
      expect(mockProvisionAdapter.disconnect).toHaveBeenCalledWith(
        "test-device"
      );
    });
  });

  describe("Error Cases", () => {
    beforeEach(() => {
      mockProvisionAdapter.disconnect.mockRejectedValue(
        new Error("Disconnect failed")
      );
    });

    test("should handle disconnection failure", async () => {
      const device = createMockESPDevice();
      await disconnectDeviceFailureTest(device);

      expect(mockProvisionAdapter.disconnect).toHaveBeenCalledWith(
        "test-device"
      );
    });

    test("should propagate disconnect error", async () => {
      const device = createMockESPDevice();
      const expectedError = new Error("Device communication error");
      mockProvisionAdapter.disconnect.mockRejectedValue(expectedError);

      try {
        await device.disconnect();
        fail("Expected disconnect to throw an error");
      } catch (error) {
        expect(error).toBe(expectedError);
      }
    });
  });
});
