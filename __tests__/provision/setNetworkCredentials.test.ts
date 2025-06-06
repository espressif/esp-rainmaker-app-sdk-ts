/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMBase } from "../../src";
import { ESPProvisionStatus } from "../../src/types/provision";
import {
  createMockESPDevice,
  MOCK_SSID,
  MOCK_PASSPHRASE,
  setNetworkCredentialsSuccessTest,
  setNetworkCredentialsWithCustomValuesTest,
  setNetworkCredentialsFailureTest,
  setNetworkCredentialsEmptySSIDTest,
  setNetworkCredentialsEmptyPassphraseTest,
  setNetworkCredentialsErrorTest,
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

describe("[Unit Test]: ESPDevice - setNetworkCredentials()", () => {
  beforeAll(() => {
    // Set the mock provision adapter
    ESPRMBase.ESPProvisionAdapter = mockProvisionAdapter;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Success Cases", () => {
    beforeEach(() => {
      mockProvisionAdapter.provision.mockResolvedValue(
        ESPProvisionStatus.success
      );
    });

    test("should set network credentials successfully", async () => {
      const device = createMockESPDevice();
      await setNetworkCredentialsSuccessTest(
        device,
        MOCK_SSID,
        MOCK_PASSPHRASE
      );

      expect(mockProvisionAdapter.provision).toHaveBeenCalledWith(
        "test-device",
        MOCK_SSID,
        MOCK_PASSPHRASE
      );
      expect(mockProvisionAdapter.provision).toHaveBeenCalledTimes(1);
    });

    test("should set network credentials with custom values", async () => {
      const device = createMockESPDevice();
      const customSSID = "CustomWiFi";
      const customPassphrase = "custompass123";

      await setNetworkCredentialsWithCustomValuesTest(
        device,
        customSSID,
        customPassphrase,
        ESPProvisionStatus.success
      );

      expect(mockProvisionAdapter.provision).toHaveBeenCalledWith(
        "test-device",
        customSSID,
        customPassphrase
      );
    });

    test("should handle empty SSID", async () => {
      const device = createMockESPDevice();
      await setNetworkCredentialsEmptySSIDTest(device);

      expect(mockProvisionAdapter.provision).toHaveBeenCalledWith(
        "test-device",
        "",
        MOCK_PASSPHRASE
      );
    });

    test("should handle empty passphrase", async () => {
      const device = createMockESPDevice();
      await setNetworkCredentialsEmptyPassphraseTest(device);

      expect(mockProvisionAdapter.provision).toHaveBeenCalledWith(
        "test-device",
        MOCK_SSID,
        ""
      );
    });
  });

  describe("Failure Cases", () => {
    beforeEach(() => {
      mockProvisionAdapter.provision.mockResolvedValue(
        ESPProvisionStatus.failure
      );
    });

    test("should handle network credentials setting failure", async () => {
      const device = createMockESPDevice();
      await setNetworkCredentialsFailureTest(device);

      expect(mockProvisionAdapter.provision).toHaveBeenCalledWith(
        "test-device",
        MOCK_SSID,
        MOCK_PASSPHRASE
      );
    });

    test("should return failure status for invalid credentials", async () => {
      const device = createMockESPDevice();
      await setNetworkCredentialsWithCustomValuesTest(
        device,
        "InvalidSSID",
        "wrongpassword",
        ESPProvisionStatus.failure
      );
    });
  });

  describe("Error Cases", () => {
    beforeEach(() => {
      mockProvisionAdapter.provision.mockRejectedValue(
        new Error("Provision adapter error")
      );
    });

    test("should handle provision adapter errors", async () => {
      const device = createMockESPDevice();
      await setNetworkCredentialsErrorTest(device);

      expect(mockProvisionAdapter.provision).toHaveBeenCalledWith(
        "test-device",
        MOCK_SSID,
        MOCK_PASSPHRASE
      );
    });

    test("should propagate specific errors", async () => {
      const device = createMockESPDevice();
      const expectedError = new Error("WiFi adapter not found");
      mockProvisionAdapter.provision.mockRejectedValue(expectedError);

      try {
        await device.setNetworkCredentials(MOCK_SSID, MOCK_PASSPHRASE);
        fail("Expected setNetworkCredentials to throw an error");
      } catch (error) {
        expect(error).toBe(expectedError);
      }
    });
  });
});
