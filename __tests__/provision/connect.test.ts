/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMBase } from "../../src";
import {
  createMockESPDevice,
  MOCK_PROV_RESPONSES,
  connectDeviceSuccessTest,
  connectDeviceWithExpectedResultsTest,
  connectDeviceFailureTest,
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

describe("[Unit Test]: ESPDevice - connect()", () => {
  beforeAll(() => {
    // Set the mock provision adapter
    ESPRMBase.ESPProvisionAdapter = mockProvisionAdapter;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Success Cases", () => {
    beforeEach(() => {
      mockProvisionAdapter.connect.mockResolvedValue(
        MOCK_PROV_RESPONSES.CONNECT_SUCCESS
      );
    });

    test("should connect to device successfully", async () => {
      const device = createMockESPDevice();
      await connectDeviceSuccessTest(device);

      expect(mockProvisionAdapter.connect).toHaveBeenCalledWith("test-device");
      expect(mockProvisionAdapter.connect).toHaveBeenCalledTimes(1);
    });

    test("should return expected response on successful connection", async () => {
      const device = createMockESPDevice();
      await connectDeviceWithExpectedResultsTest(
        device,
        MOCK_PROV_RESPONSES.CONNECT_SUCCESS
      );
    });

    test("should connect with custom device name", async () => {
      const device = createMockESPDevice({ name: "custom-device" });
      await connectDeviceSuccessTest(device);

      expect(mockProvisionAdapter.connect).toHaveBeenCalledWith(
        "custom-device"
      );
    });
  });

  describe("Error Cases", () => {
    beforeEach(() => {
      mockProvisionAdapter.connect.mockRejectedValue(
        new Error("Connection failed")
      );
    });

    test("should handle connection failure", async () => {
      const device = createMockESPDevice();
      await connectDeviceFailureTest(device);

      expect(mockProvisionAdapter.connect).toHaveBeenCalledWith("test-device");
    });

    test("should propagate connection error", async () => {
      const device = createMockESPDevice();
      const expectedError = new Error("Network timeout");
      mockProvisionAdapter.connect.mockRejectedValue(expectedError);

      try {
        await device.connect();
        fail("Expected connect to throw an error");
      } catch (error) {
        expect(error).toBe(expectedError);
      }
    });
  });
});
