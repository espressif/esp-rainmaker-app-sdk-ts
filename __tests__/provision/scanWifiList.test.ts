/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMBase } from "../../src";
import {
  createMockESPDevice,
  MOCK_WIFI_LIST,
  scanWifiListSuccessTest,
  scanWifiListWithExpectedResultsTest,
  scanWifiListFailureTest,
  scanWifiListEmptyResultsTest,
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

describe("[Unit Test]: ESPDevice - scanWifiList()", () => {
  beforeAll(() => {
    // Set the mock provision adapter
    ESPRMBase.ESPProvisionAdapter = mockProvisionAdapter;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Success Cases", () => {
    beforeEach(() => {
      mockProvisionAdapter.scanWifiList.mockResolvedValue(MOCK_WIFI_LIST);
    });

    test("should scan WiFi networks successfully", async () => {
      const device = createMockESPDevice();
      await scanWifiListSuccessTest(device);

      expect(mockProvisionAdapter.scanWifiList).toHaveBeenCalledWith(
        "test-device"
      );
      expect(mockProvisionAdapter.scanWifiList).toHaveBeenCalledTimes(1);
    });

    test("should return expected WiFi list", async () => {
      const device = createMockESPDevice();
      await scanWifiListWithExpectedResultsTest(device, MOCK_WIFI_LIST);
    });

    test("should scan with custom device name", async () => {
      const device = createMockESPDevice({ name: "custom-device" });
      await scanWifiListSuccessTest(device);

      expect(mockProvisionAdapter.scanWifiList).toHaveBeenCalledWith(
        "custom-device"
      );
    });
  });

  describe("Empty Results", () => {
    beforeEach(() => {
      mockProvisionAdapter.scanWifiList.mockResolvedValue([]);
    });

    test("should handle empty WiFi scan results", async () => {
      const device = createMockESPDevice();
      await scanWifiListEmptyResultsTest(device);

      expect(mockProvisionAdapter.scanWifiList).toHaveBeenCalledWith(
        "test-device"
      );
    });
  });

  describe("Error Cases", () => {
    beforeEach(() => {
      mockProvisionAdapter.scanWifiList.mockRejectedValue(
        new Error("Scan failed")
      );
    });

    test("should handle WiFi scan failure", async () => {
      const device = createMockESPDevice();
      await scanWifiListFailureTest(device);

      expect(mockProvisionAdapter.scanWifiList).toHaveBeenCalledWith(
        "test-device"
      );
    });

    test("should propagate scan error", async () => {
      const device = createMockESPDevice();
      const expectedError = new Error("WiFi adapter not available");
      mockProvisionAdapter.scanWifiList.mockRejectedValue(expectedError);

      try {
        await device.scanWifiList();
        fail("Expected scanWifiList to throw an error");
      } catch (error) {
        expect(error).toBe(expectedError);
      }
    });
  });
});
