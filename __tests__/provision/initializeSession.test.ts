/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMBase } from "../../src";
import {
  createMockESPDevice,
  initializeSessionSuccessTest,
  initializeSessionReturnsFalseTest,
  initializeSessionFailureTest,
  initializeSessionWithExpectedResultTest,
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

describe("[Unit Test]: ESPDevice - initializeSession()", () => {
  beforeAll(() => {
    // Set the mock provision adapter
    ESPRMBase.ESPProvisionAdapter = mockProvisionAdapter;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Success Cases", () => {
    beforeEach(() => {
      mockProvisionAdapter.initializeSession.mockResolvedValue(true);
    });

    test("should initialize session successfully", async () => {
      const device = createMockESPDevice();
      await initializeSessionSuccessTest(device);

      expect(mockProvisionAdapter.initializeSession).toHaveBeenCalledWith(
        "test-device"
      );
      expect(mockProvisionAdapter.initializeSession).toHaveBeenCalledTimes(1);
    });

    test("should initialize session with custom device name", async () => {
      const device = createMockESPDevice({ name: "custom-device" });
      await initializeSessionSuccessTest(device);

      expect(mockProvisionAdapter.initializeSession).toHaveBeenCalledWith(
        "custom-device"
      );
    });

    test("should return true on successful initialization", async () => {
      const device = createMockESPDevice();
      await initializeSessionWithExpectedResultTest(device, true);

      expect(mockProvisionAdapter.initializeSession).toHaveBeenCalledWith(
        "test-device"
      );
    });

    test("should handle multiple initialization calls", async () => {
      const device = createMockESPDevice();

      const result1 = await device.initializeSession();
      const result2 = await device.initializeSession();

      expect(result1).toBe(true);
      expect(result2).toBe(true);
      expect(mockProvisionAdapter.initializeSession).toHaveBeenCalledTimes(2);
    });
  });

  describe("Failure Cases", () => {
    beforeEach(() => {
      mockProvisionAdapter.initializeSession.mockResolvedValue(false);
    });

    test("should return false on initialization failure", async () => {
      const device = createMockESPDevice();
      await initializeSessionReturnsFalseTest(device);

      expect(mockProvisionAdapter.initializeSession).toHaveBeenCalledWith(
        "test-device"
      );
    });

    test("should handle false result with custom device", async () => {
      const device = createMockESPDevice({ name: "failing-device" });
      await initializeSessionWithExpectedResultTest(device, false);

      expect(mockProvisionAdapter.initializeSession).toHaveBeenCalledWith(
        "failing-device"
      );
    });

    test("should handle session already initialized scenario", async () => {
      const device = createMockESPDevice();

      // First call succeeds
      mockProvisionAdapter.initializeSession.mockResolvedValueOnce(true);
      // Second call returns false (already initialized)
      mockProvisionAdapter.initializeSession.mockResolvedValueOnce(false);

      const result1 = await device.initializeSession();
      const result2 = await device.initializeSession();

      expect(result1).toBe(true);
      expect(result2).toBe(false);
    });
  });

  describe("Error Cases", () => {
    beforeEach(() => {
      mockProvisionAdapter.initializeSession.mockRejectedValue(
        new Error("Session initialization failed")
      );
    });

    test("should handle session initialization failure", async () => {
      const device = createMockESPDevice();
      await initializeSessionFailureTest(device);

      expect(mockProvisionAdapter.initializeSession).toHaveBeenCalledWith(
        "test-device"
      );
    });

    test("should propagate authentication errors", async () => {
      const device = createMockESPDevice();
      const expectedError = new Error("Authentication required");
      mockProvisionAdapter.initializeSession.mockRejectedValue(expectedError);

      try {
        await device.initializeSession();
        fail("Expected initializeSession to throw an error");
      } catch (error) {
        expect(error).toBe(expectedError);
      }
    });

    test("should handle device communication errors", async () => {
      const device = createMockESPDevice();
      const expectedError = new Error("Device not responding");
      mockProvisionAdapter.initializeSession.mockRejectedValue(expectedError);

      try {
        await device.initializeSession();
        fail("Expected initializeSession to throw an error");
      } catch (error) {
        expect(error).toBe(expectedError);
      }
    });

    test("should handle network timeout errors", async () => {
      const device = createMockESPDevice();
      const expectedError = new Error("Network timeout");
      mockProvisionAdapter.initializeSession.mockRejectedValue(expectedError);

      try {
        await device.initializeSession();
        fail("Expected initializeSession to throw an error");
      } catch (error) {
        expect(error).toBe(expectedError);
      }
    });

    test("should handle security errors", async () => {
      const device = createMockESPDevice();
      const expectedError = new Error("Security handshake failed");
      mockProvisionAdapter.initializeSession.mockRejectedValue(expectedError);

      try {
        await device.initializeSession();
        fail("Expected initializeSession to throw an error");
      } catch (error) {
        expect(error).toBe(expectedError);
      }
    });
  });

  describe("Edge Cases", () => {
    test("should handle rapid successive calls", async () => {
      const device = createMockESPDevice();
      mockProvisionAdapter.initializeSession.mockResolvedValue(true);

      // Make multiple rapid calls
      const promises = Array(5)
        .fill(null)
        .map(() => device.initializeSession());
      const results = await Promise.all(promises);

      // All should succeed
      results.forEach((result) => expect(result).toBe(true));
      expect(mockProvisionAdapter.initializeSession).toHaveBeenCalledTimes(5);
    });

    test("should handle mixed success/failure scenarios", async () => {
      const device = createMockESPDevice();

      // Set up alternating success/failure
      mockProvisionAdapter.initializeSession
        .mockResolvedValueOnce(true)
        .mockResolvedValueOnce(false)
        .mockResolvedValueOnce(true);

      const result1 = await device.initializeSession();
      const result2 = await device.initializeSession();
      const result3 = await device.initializeSession();

      expect(result1).toBe(true);
      expect(result2).toBe(false);
      expect(result3).toBe(true);
    });

    test("should handle adapter returning non-boolean values", async () => {
      const device = createMockESPDevice();
      // Mock adapter returning a truthy non-boolean value
      mockProvisionAdapter.initializeSession.mockResolvedValue(
        "success" as any
      );

      const result = await device.initializeSession();
      // Should still work due to JavaScript truthiness
      expect(result).toBe("success");
    });
  });
});
