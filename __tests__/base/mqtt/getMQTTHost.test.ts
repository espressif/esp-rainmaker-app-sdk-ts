/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMBase } from "../../../src";
import { ESPRMAPIManager } from "../../../src/services/ESPRMAPIManager";
import { ESPConfigError } from "../../../src/utils/error/Error";
import { ConfigErrorCodes } from "../../../src/utils/constants";
import {
  MOCK_BASE_CONFIG,
  MOCK_MQTT_HOSTS,
  MOCK_MQTT_RESPONSES,
  getMQTTHostSuccessTest,
} from "../../helpers/base";

// Mock API manager
jest.mock("../../../src/services/ESPRMAPIManager");
jest.mock("../../../src/services/ESPRMStorage/ESPRMStorage");

describe("[Unit Test]: ESPRMBase - getMQTTHost()", () => {
  let mockRequest: jest.SpyInstance;

  beforeAll(() => {
    // Mock the request method
    mockRequest = jest.spyOn(ESPRMAPIManager, "request");
  });

  beforeEach(() => {
    jest.clearAllMocks();
    // Configure ESPRMBase for each test
    ESPRMBase.configure(MOCK_BASE_CONFIG);
  });

  describe("Success Cases", () => {
    test("should retrieve MQTT host successfully", async () => {
      mockRequest.mockResolvedValue(MOCK_MQTT_RESPONSES.SUCCESS);

      await getMQTTHostSuccessTest(MOCK_MQTT_HOSTS.PRIMARY);
    });
  });

  describe("Error Cases", () => {
    test("should throw ESPConfigError when SDK is not configured", async () => {
      // Mock getConfig to throw the error
      const mockGetConfig = jest.spyOn(ESPRMBase, "getConfig");
      mockGetConfig.mockImplementation(() => {
        throw new ESPConfigError(ConfigErrorCodes.SDK_NOT_CONFIGURED);
      });

      try {
        await ESPRMBase.getMQTTHost();
        fail("Expected getMQTTHost to throw an error");
      } catch (error) {
        expect(error).toBeInstanceOf(ESPConfigError);
        expect(error).toHaveProperty(
          "code",
          ConfigErrorCodes.SDK_NOT_CONFIGURED
        );
      }

      expect(mockRequest).not.toHaveBeenCalled();

      // Restore the original implementation
      mockGetConfig.mockRestore();
    });
  });
});
