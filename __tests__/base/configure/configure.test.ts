/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMBase } from "../../../src";
import { ESPRMAPIManager } from "../../../src/services/ESPRMAPIManager";
import { ClaimingHelper } from "../../../src/services/ESPRMHelpers/ClaimingHelper";
import { ESPRMBaseConfig } from "../../../src/types/input";
import { ESPConfigError } from "../../../src/utils/error/Error";
import { ESPClaimError } from "../../../src/utils/error/ESPClaimError";
import {
  ClaimErrorCodes,
  ConfigErrorCodes,
  DEFAULT_REST_API_VERSION,
} from "../../../src/utils/constants";
import {
  MOCK_BASE_CONFIG,
  MOCK_BASE_CONFIG_WITH_CLAIM_URL,
  MOCK_CLAIM_URL,
} from "../../helpers/base";

// Mock API manager
jest.mock("../../../src/services/ESPRMAPIManager");
jest.mock("../../../src/services/ESPRMStorage/ESPRMStorage");

const MOCK_AUTH_CONFIG: ESPRMBaseConfig = {
  ...MOCK_BASE_CONFIG,
  authUrl: "https://test.auth.com",
  redirectUrl: "https://test.redirect.com",
  clientId: "test-client-id",
};

/**
 * Helper to assert that configure() throws an ESPConfigError with the given code
 * @param config - The invalid configuration to pass to configure()
 * @param code - The expected ESPConfigError code
 */
function expectConfigError(config: ESPRMBaseConfig, code: string) {
  try {
    ESPRMBase.configure(config);
    fail("Expected configure to throw an error");
  } catch (error) {
    expect(error).toBeInstanceOf(ESPConfigError);
    expect(error).toHaveProperty("code", code);
  }
}

describe("[Unit Test]: ESPRMBase - configure()", () => {
  let mockAuthorizeRequest: jest.SpyInstance;

  beforeAll(() => {
    // Mock the authorizeRequest method used by ClaimingHelper
    mockAuthorizeRequest = jest.spyOn(ESPRMAPIManager, "authorizeRequest");
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Success Cases", () => {
    test("should store the provided config and version", () => {
      ESPRMBase.configure(MOCK_BASE_CONFIG);

      const config = ESPRMBase.getConfig();
      expect(config.baseUrl).toBe(MOCK_BASE_CONFIG.baseUrl);
      expect(config.version).toBe(MOCK_BASE_CONFIG.version);
    });

    test("should apply the default REST API version when version is omitted", () => {
      ESPRMBase.configure({ baseUrl: MOCK_BASE_CONFIG.baseUrl });

      expect(ESPRMBase.getConfig().version).toBe(DEFAULT_REST_API_VERSION);
    });

    test("should store auth fields when authUrl, redirectUrl and clientId are provided", () => {
      ESPRMBase.configure(MOCK_AUTH_CONFIG);

      const config = ESPRMBase.getConfig();
      expect(config.authUrl).toBe(MOCK_AUTH_CONFIG.authUrl);
      expect(config.redirectUrl).toBe(MOCK_AUTH_CONFIG.redirectUrl);
      expect(config.clientId).toBe(MOCK_AUTH_CONFIG.clientId);
    });

    test("should use configured claimUrl for claiming API calls", async () => {
      mockAuthorizeRequest.mockResolvedValue({});

      ESPRMBase.configure(MOCK_BASE_CONFIG_WITH_CLAIM_URL);
      expect(ESPRMBase.getConfig().claimUrl).toBe(MOCK_CLAIM_URL);
      await ClaimingHelper.initiateClaim({});
      expect(mockAuthorizeRequest).toHaveBeenLastCalledWith(
        expect.objectContaining({ baseURL: MOCK_CLAIM_URL })
      );
    });
  });

  describe("Error Cases", () => {
    test("should throw ESPConfigError when config is not a valid object", () => {
      expectConfigError(
        null as unknown as ESPRMBaseConfig,
        ConfigErrorCodes.INVALID_CONFIG_OBJECT
      );
    });

    test("should throw ESPConfigError when baseUrl is not a valid URL", () => {
      expectConfigError(
        { ...MOCK_BASE_CONFIG, baseUrl: "invalid-url" },
        ConfigErrorCodes.INVALID_BASE_URL
      );
    });

    test("should throw ESPConfigError when claimUrl is not a valid URL", () => {
      expectConfigError(
        { ...MOCK_BASE_CONFIG, claimUrl: "invalid-url" },
        ConfigErrorCodes.INVALID_CLAIM_BASE_URL
      );
    });

    test("should throw ESPConfigError when authUrl is not a valid URL", () => {
      expectConfigError(
        { ...MOCK_AUTH_CONFIG, authUrl: "invalid-url" },
        ConfigErrorCodes.INVALID_AUTH_URL
      );
    });

    test("should throw ESPConfigError when authUrl is provided without redirectUrl", () => {
      expectConfigError(
        { ...MOCK_AUTH_CONFIG, redirectUrl: undefined },
        ConfigErrorCodes.REDIRECT_URL_REQUIRED
      );
    });

    test("should throw ESPConfigError when redirectUrl is not a valid URL", () => {
      expectConfigError(
        { ...MOCK_AUTH_CONFIG, redirectUrl: "invalid-url" },
        ConfigErrorCodes.INVALID_REDIRECT_URL
      );
    });

    test("should throw ESPConfigError when authUrl is provided without clientId", () => {
      expectConfigError(
        { ...MOCK_AUTH_CONFIG, clientId: undefined },
        ConfigErrorCodes.CLIENT_ID_REQUIRED
      );
    });

    test("should throw ESPClaimError when claiming is attempted without claimUrl configured", async () => {
      ESPRMBase.configure(MOCK_BASE_CONFIG);

      try {
        await ClaimingHelper.initiateClaim({});
        fail("Expected initiateClaim to throw an error");
      } catch (error) {
        expect(error).toBeInstanceOf(ESPClaimError);
        expect(error).toHaveProperty(
          "code",
          ClaimErrorCodes.CLAIM_URL_NOT_CONFIGURED
        );
      }

      expect(mockAuthorizeRequest).not.toHaveBeenCalled();
    });
  });
});
