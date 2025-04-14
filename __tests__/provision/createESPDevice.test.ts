/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMBase, ESPRMUser } from "../../src";
import { ESPTransport, ESPSecurity } from "../../src/types/provision";
import { provErrorMessages } from "../../src/utils/error/errorMessages";
import {
  MOCK_USER_TOKENS,
  MOCK_DEVICE_CONFIG,
  MOCK_TRANSPORT,
  createESPDeviceSuccessTest,
  createESPDeviceWithAllParamsTest,
  createESPDeviceFailureTest,
  createESPDeviceEmptyNameTest,
} from "../helpers/provision";

// Mock dependencies required for user token storage while creating ESPRMUser instance
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

describe("[Unit Test]: ESPRMUser - createESPDevice()", () => {
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
      mockProvisionAdapter.createESPDevice.mockResolvedValue(
        MOCK_DEVICE_CONFIG
      );
    });

    test("should create ESP device successfully with minimal parameters", async () => {
      await createESPDeviceSuccessTest(
        user,
        "test-device",
        MOCK_TRANSPORT as ESPTransport
      );

      expect(mockProvisionAdapter.createESPDevice).toHaveBeenCalledWith(
        "test-device",
        MOCK_TRANSPORT,
        undefined,
        undefined,
        undefined,
        undefined
      );
      expect(mockProvisionAdapter.createESPDevice).toHaveBeenCalledTimes(1);
    });

    test("should create ESP device with all parameters", async () => {
      const paramConfig = {
        name: "test-device",
        transport: MOCK_TRANSPORT as ESPTransport,
        security: ESPSecurity.secure,
        proofOfPossession: "test-pop",
        softAPPassword: "test-password",
        username: "test-username",
      };
      await createESPDeviceWithAllParamsTest(user, paramConfig);

      expect(mockProvisionAdapter.createESPDevice).toHaveBeenCalledWith(
        paramConfig.name,
        paramConfig.transport,
        paramConfig.security,
        paramConfig.proofOfPossession,
        paramConfig.softAPPassword,
        paramConfig.username
      );
    });

    test("should handle BLE transport", async () => {
      const device = await user.createESPDevice("ble-device", ESPTransport.ble);

      expect(device).toBeDefined();
      expect(mockProvisionAdapter.createESPDevice).toHaveBeenCalledWith(
        "ble-device",
        ESPTransport.ble,
        undefined,
        undefined,
        undefined,
        undefined
      );
    });

    test("should handle SoftAP transport", async () => {
      const device = await user.createESPDevice(
        "softap-device",
        ESPTransport.softap
      );

      expect(device).toBeDefined();
      expect(mockProvisionAdapter.createESPDevice).toHaveBeenCalledWith(
        "softap-device",
        ESPTransport.softap,
        undefined,
        undefined,
        undefined,
        undefined
      );
    });

    test("should create device with secure security", async () => {
      const device = await user.createESPDevice(
        "secure-device",
        ESPTransport.ble,
        ESPSecurity.secure
      );

      expect(device).toBeDefined();
      expect(mockProvisionAdapter.createESPDevice).toHaveBeenCalledWith(
        "secure-device",
        ESPTransport.ble,
        ESPSecurity.secure,
        undefined,
        undefined,
        undefined
      );
    });

    test("should create device with proof of possession", async () => {
      const device = await user.createESPDevice(
        "pop-device",
        ESPTransport.ble,
        ESPSecurity.secure,
        "test-pop"
      );

      expect(device).toBeDefined();
      expect(mockProvisionAdapter.createESPDevice).toHaveBeenCalledWith(
        "pop-device",
        ESPTransport.ble,
        ESPSecurity.secure,
        "test-pop",
        undefined,
        undefined
      );
    });

    test("should handle direct method call", async () => {
      const device = await user.createESPDevice(
        "test-device",
        ESPTransport.ble
      );

      expect(device).toBeDefined();
      expect(device.name).toBe("test-device");
      expect(mockProvisionAdapter.createESPDevice).toHaveBeenCalledWith(
        "test-device",
        ESPTransport.ble,
        undefined,
        undefined,
        undefined,
        undefined
      );
    });
  });

  describe("Failure Cases", () => {
    beforeEach(() => {
      mockProvisionAdapter.createESPDevice.mockRejectedValue(
        new Error("Failed to create device")
      );
    });

    test("should handle adapter failure", async () => {
      await createESPDeviceFailureTest(user);

      expect(mockProvisionAdapter.createESPDevice).toHaveBeenCalledWith(
        "test-device",
        MOCK_TRANSPORT,
        undefined,
        undefined,
        undefined,
        undefined
      );
    });

    test("should propagate adapter errors", async () => {
      const errorMessage = "Device name already exists";
      mockProvisionAdapter.createESPDevice.mockRejectedValue(
        new Error(errorMessage)
      );

      try {
        await user.createESPDevice("duplicate-device", ESPTransport.ble);
        fail("Expected createESPDevice to throw an error");
      } catch (error: any) {
        expect(error.message).toBe(errorMessage);
      }
    });

    test("should handle empty device name", async () => {
      await createESPDeviceEmptyNameTest(user);
    });
  });

  describe("Parameter Validation Cases", () => {
    beforeEach(() => {
      mockProvisionAdapter.createESPDevice.mockResolvedValue(
        MOCK_DEVICE_CONFIG
      );
    });

    test("should handle different security levels", async () => {
      // Test unsecure
      await user.createESPDevice(
        "unsecure-device",
        ESPTransport.ble,
        ESPSecurity.unsecure
      );
      expect(mockProvisionAdapter.createESPDevice).toHaveBeenLastCalledWith(
        "unsecure-device",
        ESPTransport.ble,
        ESPSecurity.unsecure,
        undefined,
        undefined,
        undefined
      );

      // Test secure2
      await user.createESPDevice(
        "secure2-device",
        ESPTransport.ble,
        ESPSecurity.secure2
      );
      expect(mockProvisionAdapter.createESPDevice).toHaveBeenLastCalledWith(
        "secure2-device",
        ESPTransport.ble,
        ESPSecurity.secure2,
        undefined,
        undefined,
        undefined
      );
    });

    test("should pass all optional parameters correctly", async () => {
      const deviceName = "full-params-device";
      const transport = ESPTransport.softap;
      const security = ESPSecurity.secure;
      const pop = "test-pop-123";
      const password = "test-password-456";
      const username = "test-username-789";

      await user.createESPDevice(
        deviceName,
        transport,
        security,
        pop,
        password,
        username
      );

      expect(mockProvisionAdapter.createESPDevice).toHaveBeenCalledWith(
        deviceName,
        transport,
        security,
        pop,
        password,
        username
      );
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
        await user.createESPDevice("test-device", ESPTransport.ble);
        fail(
          "Expected createESPDevice to throw an error when adapter is missing"
        );
      } catch (error: any) {
        expect(error).toBeDefined();
        expect(error.message).toContain(provErrorMessages.MISSING_PROV_ADAPTER);
      }
    });
  });
});
