/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMBase, ESPRMUser } from "../../src";
import { provErrorMessages } from "../../src/utils/error/errorMessages";
import {
  MOCK_USER_TOKENS,
  stopESPDevicesSearchSuccessTest,
  stopESPDevicesSearchFailureTest,
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

describe("[Unit Test]: ESPRMUser - stopESPDevicesSearch()", () => {
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
      mockProvisionAdapter.stopESPDevicesSearch.mockResolvedValue(undefined);
    });

    test("should stop ESP devices search successfully", async () => {
      await stopESPDevicesSearchSuccessTest(user);

      expect(mockProvisionAdapter.stopESPDevicesSearch).toHaveBeenCalledWith();
      expect(mockProvisionAdapter.stopESPDevicesSearch).toHaveBeenCalledTimes(
        1
      );
    });

    test("should handle direct method call", async () => {
      await user.stopESPDevicesSearch();

      expect(mockProvisionAdapter.stopESPDevicesSearch).toHaveBeenCalledWith();
      expect(mockProvisionAdapter.stopESPDevicesSearch).toHaveBeenCalledTimes(
        1
      );
    });

    test("should handle void return value correctly", async () => {
      const result = await user.stopESPDevicesSearch();

      expect(result).toBeUndefined();
      expect(mockProvisionAdapter.stopESPDevicesSearch).toHaveBeenCalledWith();
    });

    test("should handle multiple calls", async () => {
      await user.stopESPDevicesSearch();
      await user.stopESPDevicesSearch();

      expect(mockProvisionAdapter.stopESPDevicesSearch).toHaveBeenCalledTimes(
        2
      );
    });
  });

  describe("Failure Cases", () => {
    beforeEach(() => {
      mockProvisionAdapter.stopESPDevicesSearch.mockRejectedValue(
        new Error("Failed to stop search")
      );
    });

    test("should handle adapter failure", async () => {
      await stopESPDevicesSearchFailureTest(user);

      expect(mockProvisionAdapter.stopESPDevicesSearch).toHaveBeenCalledWith();
    });

    test("should propagate adapter errors", async () => {
      const errorMessage = "Search already stopped";
      mockProvisionAdapter.stopESPDevicesSearch.mockRejectedValue(
        new Error(errorMessage)
      );

      try {
        await user.stopESPDevicesSearch();
        fail("Expected stopESPDevicesSearch to throw an error");
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
        await user.stopESPDevicesSearch();
        fail(
          "Expected stopESPDevicesSearch to throw an error when adapter is missing"
        );
      } catch (error: any) {
        expect(error).toBeDefined();
        expect(error.message).toContain(provErrorMessages.MISSING_PROV_ADAPTER);
      }
    });
  });
});
