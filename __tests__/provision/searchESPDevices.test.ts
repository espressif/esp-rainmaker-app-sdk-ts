/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMBase, ESPRMUser } from "../../src";
import { ESPTransport } from "../../src/types/provision";
import { provErrorMessages } from "../../src/utils/error/errorMessages";
import {
  MOCK_ESP_DEVICES,
  MOCK_DEVICE_PREFIX,
  MOCK_TRANSPORT,
  MOCK_USER_TOKENS,
  searchESPDevicesSuccessTest,
  searchESPDevicesWithExpectedResultsTest,
  searchESPDevicesWithCustomParamsTest,
  searchESPDevicesFailureTest,
  searchESPDevicesEmptyResultsTest,
} from "../helpers/provision";

// Mock dependencies
jest.mock("../../src/services/ESPRMStorage/ESPRMStorage");

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

describe("[Unit Test]: ESPRMUser - searchESPDevices()", () => {
  let user: ESPRMUser;

  beforeAll(() => {
    // Set the mock provision adapter
    ESPRMBase.ESPProvisionAdapter = mockProvisionAdapter;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    user = new ESPRMUser(MOCK_USER_TOKENS);
  });

  describe("Success Cases", () => {
    beforeEach(() => {
      mockProvisionAdapter.searchESPDevices.mockResolvedValue(MOCK_ESP_DEVICES);
    });

    test("should search ESP devices successfully", async () => {
      await searchESPDevicesSuccessTest(
        user,
        MOCK_DEVICE_PREFIX,
        MOCK_TRANSPORT as ESPTransport
      );

      expect(mockProvisionAdapter.searchESPDevices).toHaveBeenCalledWith(
        MOCK_DEVICE_PREFIX,
        MOCK_TRANSPORT
      );
      expect(mockProvisionAdapter.searchESPDevices).toHaveBeenCalledTimes(1);
    });

    test("should return expected number of devices", async () => {
      await searchESPDevicesWithExpectedResultsTest(
        user,
        MOCK_ESP_DEVICES.length
      );
    });

    test("should search with custom parameters", async () => {
      const customPrefix = "ESP_";
      const customTransport = ESPTransport.softap;

      await searchESPDevicesWithCustomParamsTest(
        user,
        customPrefix,
        customTransport
      );

      expect(mockProvisionAdapter.searchESPDevices).toHaveBeenCalledWith(
        customPrefix,
        customTransport
      );
    });

    test("should handle direct method call", async () => {
      const devices = await user.searchESPDevices(
        MOCK_DEVICE_PREFIX,
        MOCK_TRANSPORT as ESPTransport
      );

      expect(devices).toHaveLength(MOCK_ESP_DEVICES.length);
      expect(mockProvisionAdapter.searchESPDevices).toHaveBeenCalledWith(
        MOCK_DEVICE_PREFIX,
        MOCK_TRANSPORT
      );
    });

    test("should search with BLE transport", async () => {
      await user.searchESPDevices("PROV_", ESPTransport.ble);

      expect(mockProvisionAdapter.searchESPDevices).toHaveBeenCalledWith(
        "PROV_",
        ESPTransport.ble
      );
    });

    test("should search with SoftAP transport", async () => {
      await user.searchESPDevices("ESP_", ESPTransport.softap);

      expect(mockProvisionAdapter.searchESPDevices).toHaveBeenCalledWith(
        "ESP_",
        ESPTransport.softap
      );
    });
  });

  describe("Empty Results Cases", () => {
    beforeEach(() => {
      mockProvisionAdapter.searchESPDevices.mockResolvedValue([]);
    });

    test("should handle empty search results", async () => {
      await searchESPDevicesEmptyResultsTest(user);

      expect(mockProvisionAdapter.searchESPDevices).toHaveBeenCalledWith(
        MOCK_DEVICE_PREFIX,
        MOCK_TRANSPORT
      );
    });

    test("should return empty array when no devices found", async () => {
      const devices = await user.searchESPDevices(
        "NONEXISTENT_",
        ESPTransport.ble
      );

      expect(devices).toEqual([]);
      expect(Array.isArray(devices)).toBe(true);
    });
  });

  describe("Failure Cases", () => {
    beforeEach(() => {
      mockProvisionAdapter.searchESPDevices.mockRejectedValue(
        new Error("Failed to search devices")
      );
    });

    test("should handle adapter failure", async () => {
      await searchESPDevicesFailureTest(user);

      expect(mockProvisionAdapter.searchESPDevices).toHaveBeenCalledWith(
        MOCK_DEVICE_PREFIX,
        MOCK_TRANSPORT
      );
    });

    test("should propagate adapter errors", async () => {
      const errorMessage = "Bluetooth not available";
      mockProvisionAdapter.searchESPDevices.mockRejectedValue(
        new Error(errorMessage)
      );

      try {
        await user.searchESPDevices(MOCK_DEVICE_PREFIX, ESPTransport.ble);
        fail("Expected searchESPDevices to throw an error");
      } catch (error: any) {
        expect(error.message).toBe(errorMessage);
      }
    });
  });

  describe("Missing Adapter Cases", () => {
    beforeEach(() => {
      // Temporarily remove the provision adapter
      ESPRMBase.ESPProvisionAdapter = null as any;
    });

    afterEach(() => {
      // Restore the provision adapter
      ESPRMBase.ESPProvisionAdapter = mockProvisionAdapter;
    });

    test("should throw error when provision adapter is missing", async () => {
      try {
        await user.searchESPDevices(MOCK_DEVICE_PREFIX, ESPTransport.ble);
        fail(
          "Expected searchESPDevices to throw an error when adapter is missing"
        );
      } catch (error: any) {
        expect(error).toBeDefined();
        expect(error.message).toContain(provErrorMessages.MISSING_PROV_ADAPTER);
      }
    });
  });
});
