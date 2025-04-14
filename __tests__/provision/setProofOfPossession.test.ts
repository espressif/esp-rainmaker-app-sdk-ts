/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMBase } from "../../src";
import {
  createMockESPDevice,
  MOCK_PROOF_OF_POSSESSION,
  setProofOfPossessionSuccessTest,
  setProofOfPossessionWithCustomValueTest,
  setProofOfPossessionFailureTest,
  setProofOfPossessionEmptyTest,
  setProofOfPossessionReturnsFalseTest,
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

describe("[Unit Test]: ESPDevice - setProofOfPossession()", () => {
  beforeAll(() => {
    // Set the mock provision adapter
    ESPRMBase.ESPProvisionAdapter = mockProvisionAdapter;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Success Cases", () => {
    beforeEach(() => {
      mockProvisionAdapter.setProofOfPossession.mockResolvedValue(true);
    });

    test("should set proof of possession successfully", async () => {
      const device = createMockESPDevice();
      await setProofOfPossessionSuccessTest(device);

      expect(mockProvisionAdapter.setProofOfPossession).toHaveBeenCalledWith(
        "test-device",
        MOCK_PROOF_OF_POSSESSION
      );
      expect(mockProvisionAdapter.setProofOfPossession).toHaveBeenCalledTimes(
        1
      );
    });

    test("should set proof of possession with custom value", async () => {
      const device = createMockESPDevice();
      const customPop = "custom-proof-123";

      await setProofOfPossessionWithCustomValueTest(device, customPop, true);

      expect(mockProvisionAdapter.setProofOfPossession).toHaveBeenCalledWith(
        "test-device",
        customPop
      );
    });

    test("should handle different device names", async () => {
      const device = createMockESPDevice({ name: "custom-device" });
      await setProofOfPossessionSuccessTest(device);

      expect(mockProvisionAdapter.setProofOfPossession).toHaveBeenCalledWith(
        "custom-device",
        MOCK_PROOF_OF_POSSESSION
      );
    });

    test("should handle empty proof of possession", async () => {
      const device = createMockESPDevice();
      mockProvisionAdapter.setProofOfPossession.mockResolvedValue(false);

      await setProofOfPossessionEmptyTest(device);

      expect(mockProvisionAdapter.setProofOfPossession).toHaveBeenCalledWith(
        "test-device",
        ""
      );
    });
  });

  describe("Failure Cases", () => {
    beforeEach(() => {
      mockProvisionAdapter.setProofOfPossession.mockResolvedValue(false);
    });

    test("should return false for invalid proof of possession", async () => {
      const device = createMockESPDevice();
      await setProofOfPossessionReturnsFalseTest(device);

      expect(mockProvisionAdapter.setProofOfPossession).toHaveBeenCalledWith(
        "test-device",
        MOCK_PROOF_OF_POSSESSION
      );
    });

    test("should handle rejection with false result", async () => {
      const device = createMockESPDevice();
      await setProofOfPossessionWithCustomValueTest(
        device,
        "invalid-proof",
        false
      );

      expect(mockProvisionAdapter.setProofOfPossession).toHaveBeenCalledWith(
        "test-device",
        "invalid-proof"
      );
    });
  });

  describe("Error Cases", () => {
    beforeEach(() => {
      mockProvisionAdapter.setProofOfPossession.mockRejectedValue(
        new Error("Failed to set proof of possession")
      );
    });

    test("should handle proof of possession setting failure", async () => {
      const device = createMockESPDevice();
      await setProofOfPossessionFailureTest(device);

      expect(mockProvisionAdapter.setProofOfPossession).toHaveBeenCalledWith(
        "test-device",
        MOCK_PROOF_OF_POSSESSION
      );
    });

    test("should propagate specific errors", async () => {
      const device = createMockESPDevice();
      const expectedError = new Error("Authentication failed");
      mockProvisionAdapter.setProofOfPossession.mockRejectedValue(
        expectedError
      );

      try {
        await device.setProofOfPossession(MOCK_PROOF_OF_POSSESSION);
        fail("Expected setProofOfPossession to throw an error");
      } catch (error) {
        expect(error).toBe(expectedError);
      }
    });

    test("should handle device communication errors", async () => {
      const device = createMockESPDevice();
      const expectedError = new Error("Device not responding");
      mockProvisionAdapter.setProofOfPossession.mockRejectedValue(
        expectedError
      );

      try {
        await device.setProofOfPossession("test-proof");
        fail("Expected setProofOfPossession to throw an error");
      } catch (error) {
        expect(error).toBe(expectedError);
      }
    });
  });

  describe("Edge Cases", () => {
    test("should handle null/undefined proof of possession", async () => {
      const device = createMockESPDevice();
      mockProvisionAdapter.setProofOfPossession.mockResolvedValue(false);

      // Test with empty string (closest to null/undefined behavior)
      const result = await device.setProofOfPossession("");
      expect(typeof result).toBe("boolean");
      expect(mockProvisionAdapter.setProofOfPossession).toHaveBeenCalledWith(
        "test-device",
        ""
      );
    });

    test("should handle very long proof of possession", async () => {
      const device = createMockESPDevice();
      const longProof = "a".repeat(1000);
      mockProvisionAdapter.setProofOfPossession.mockResolvedValue(true);

      const result = await device.setProofOfPossession(longProof);
      expect(result).toBe(true);
      expect(mockProvisionAdapter.setProofOfPossession).toHaveBeenCalledWith(
        "test-device",
        longProof
      );
    });
  });
});
