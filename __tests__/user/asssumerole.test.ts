/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMUser } from "../../src/ESPRMUser";
import { ESPRMAPIManager } from "../../src/services/ESPRMAPIManager";
import { ESPUserRole } from "../../src/types";
import {
  APIEndpoints,
  HTTPMethods,
  AssumeRoleConstants,
} from "../../src/utils/constants";
import { MOCK_USER_TOKENS } from "../helpers/provision/utils";
import {
  assumeRoleWithNodeIdsSuccessTest,
  assumeRoleWithGroupIdsSuccessTest,
  assumeRoleWithEmptyRequestSuccessTest,
  assumeRoleResponseStructureTest,
  assumeRoleExceedsMaxNodeIdsTest,
  assumeRoleExceedsMaxGroupIdsTest,
  assumeRoleInvalidUserRoleTest,
  assumeRoleBothGroupIdsAndNodeIdsTest,
  assumeRoleVideostreamWithoutNodeIdsTest,
  assumeRoleAPIErrorTest,
  MOCK_ASSUME_ROLE_RESPONSE,
  MOCK_API_ERROR_RESPONSE,
} from "../helpers/user";

// Mock dependencies required for user token storage while creating ESPRMUser instance
jest.mock("../../src/services/ESPRMStorage/ESPRMStorage");

describe("[Unit Test]: ESPRMUser - assumeRole()", () => {
  let user: ESPRMUser;

  beforeEach(() => {
    user = new ESPRMUser(MOCK_USER_TOKENS);
  });

  describe("Success Cases", () => {
    test("should assume role successfully with nodeIds and return AWS credentials", async () => {
      // Mock the authorizeRequest method
      const mockAuthorizeRequest = jest.spyOn(
        ESPRMAPIManager,
        "authorizeRequest"
      );
      mockAuthorizeRequest.mockResolvedValue(MOCK_ASSUME_ROLE_RESPONSE);

      const request = {
        userRole: "mqtt",
        nodeIds: ["test-node-id"],
      };
      await assumeRoleWithNodeIdsSuccessTest(user, request);

      expect(mockAuthorizeRequest).toHaveBeenCalledWith({
        url: APIEndpoints.USER_ASSUME_ROLE,
        method: HTTPMethods.POST,
        data: {
          user_role: "mqtt",
          node_ids: ["test-node-id"],
        },
      });
      expect(mockAuthorizeRequest).toHaveBeenCalledTimes(1);
    });

    test("should assume role successfully with groupIds", async () => {
      // Mock the authorizeRequest method
      const mockAuthorizeRequest = jest.spyOn(
        ESPRMAPIManager,
        "authorizeRequest"
      );
      mockAuthorizeRequest.mockResolvedValue(MOCK_ASSUME_ROLE_RESPONSE);

      const request = {
        userRole: "mqtt",
        groupIds: ["group-id-1"],
      };
      await assumeRoleWithGroupIdsSuccessTest(user, request);

      expect(mockAuthorizeRequest).toHaveBeenCalledWith({
        url: APIEndpoints.USER_ASSUME_ROLE,
        method: HTTPMethods.POST,
        data: {
          user_role: "mqtt",
          group_ids: ["group-id-1"],
        },
      });
    });

    test("should assume role successfully with videostream role and nodeIds", async () => {
      // Mock the authorizeRequest method
      const mockAuthorizeRequest = jest.spyOn(
        ESPRMAPIManager,
        "authorizeRequest"
      );
      mockAuthorizeRequest.mockResolvedValue(MOCK_ASSUME_ROLE_RESPONSE);

      const request = {
        userRole: "videostream",
        nodeIds: ["node-id-1", "node-id-2"],
      };
      await assumeRoleWithNodeIdsSuccessTest(user, request);

      expect(mockAuthorizeRequest).toHaveBeenCalledWith({
        url: APIEndpoints.USER_ASSUME_ROLE,
        method: HTTPMethods.POST,
        data: {
          user_role: "videostream",
          node_ids: ["node-id-1", "node-id-2"],
        },
      });
    });

    test("should assume role successfully with ESPUserRole enum value", async () => {
      // Mock the authorizeRequest method
      const mockAuthorizeRequest = jest.spyOn(
        ESPRMAPIManager,
        "authorizeRequest"
      );
      mockAuthorizeRequest.mockResolvedValue(MOCK_ASSUME_ROLE_RESPONSE);

      const request = {
        userRole: ESPUserRole.MQTT,
        nodeIds: ["test-node-id"],
      };
      await assumeRoleWithNodeIdsSuccessTest(user, request);

      expect(mockAuthorizeRequest).toHaveBeenCalledWith({
        url: APIEndpoints.USER_ASSUME_ROLE,
        method: HTTPMethods.POST,
        data: {
          user_role: "mqtt",
          node_ids: ["test-node-id"],
        },
      });
    });

    test("should assume role successfully with ESPUserRole.VIDEOSTREAM enum", async () => {
      // Mock the authorizeRequest method
      const mockAuthorizeRequest = jest.spyOn(
        ESPRMAPIManager,
        "authorizeRequest"
      );
      mockAuthorizeRequest.mockResolvedValue(MOCK_ASSUME_ROLE_RESPONSE);

      const request = {
        userRole: ESPUserRole.VIDEOSTREAM,
        nodeIds: ["node-id-1"],
      };
      await assumeRoleWithNodeIdsSuccessTest(user, request);

      expect(mockAuthorizeRequest).toHaveBeenCalledWith({
        url: APIEndpoints.USER_ASSUME_ROLE,
        method: HTTPMethods.POST,
        data: {
          user_role: "videostream",
          node_ids: ["node-id-1"],
        },
      });
    });

    test("should assume role successfully with mqtt role and no nodeIds or groupIds", async () => {
      // Mock the authorizeRequest method
      const mockAuthorizeRequest = jest.spyOn(
        ESPRMAPIManager,
        "authorizeRequest"
      );
      mockAuthorizeRequest.mockResolvedValue(MOCK_ASSUME_ROLE_RESPONSE);

      const request = {
        userRole: ESPUserRole.MQTT,
      };
      await assumeRoleWithEmptyRequestSuccessTest(user, request);

      expect(mockAuthorizeRequest).toHaveBeenCalledWith({
        url: APIEndpoints.USER_ASSUME_ROLE,
        method: HTTPMethods.POST,
        data: {
          user_role: "mqtt",
        },
      });
    });

    test("should assume role successfully with max nodeIds", async () => {
      // Mock the authorizeRequest method
      const mockAuthorizeRequest = jest.spyOn(
        ESPRMAPIManager,
        "authorizeRequest"
      );
      mockAuthorizeRequest.mockResolvedValue(MOCK_ASSUME_ROLE_RESPONSE);

      const nodeIds = Array.from(
        { length: AssumeRoleConstants.MAX_NODE_IDS },
        (_, i) => `node${i + 1}`
      );
      const request = {
        userRole: "mqtt",
        nodeIds: nodeIds,
      };
      await assumeRoleWithNodeIdsSuccessTest(user, request);

      expect(mockAuthorizeRequest).toHaveBeenCalledWith({
        url: APIEndpoints.USER_ASSUME_ROLE,
        method: HTTPMethods.POST,
        data: {
          user_role: "mqtt",
          node_ids: nodeIds,
        },
      });
    });

    test("should assume role successfully with max groupIds", async () => {
      // Mock the authorizeRequest method
      const mockAuthorizeRequest = jest.spyOn(
        ESPRMAPIManager,
        "authorizeRequest"
      );
      mockAuthorizeRequest.mockResolvedValue(MOCK_ASSUME_ROLE_RESPONSE);

      const groupIds = Array.from(
        { length: AssumeRoleConstants.MAX_GROUP_IDS },
        (_, i) => `group${i + 1}`
      );
      const request = {
        userRole: "mqtt",
        groupIds: groupIds,
      };
      await assumeRoleWithGroupIdsSuccessTest(user, request);

      expect(mockAuthorizeRequest).toHaveBeenCalledWith({
        url: APIEndpoints.USER_ASSUME_ROLE,
        method: HTTPMethods.POST,
        data: {
          user_role: "mqtt",
          group_ids: groupIds,
        },
      });
    });

    test("should return response with all required fields", async () => {
      // Mock the authorizeRequest method
      const mockAuthorizeRequest = jest.spyOn(
        ESPRMAPIManager,
        "authorizeRequest"
      );
      mockAuthorizeRequest.mockResolvedValue(MOCK_ASSUME_ROLE_RESPONSE);

      const request = {
        userRole: "mqtt",
        nodeIds: ["test-node-id"],
      };
      await assumeRoleResponseStructureTest(user, request);
    });
  });

  describe("Validation Error Cases", () => {
    test("should throw error when more than max nodeIds are provided", async () => {
      const nodeIds = Array.from(
        { length: AssumeRoleConstants.MAX_NODE_IDS + 1 },
        (_, i) => `node${i + 1}`
      );
      const request = {
        userRole: "mqtt",
        nodeIds: nodeIds,
      };

      await assumeRoleExceedsMaxNodeIdsTest(user, request);
    });

    test("should throw error when more than max groupIds are provided", async () => {
      const groupIds = Array.from(
        { length: AssumeRoleConstants.MAX_GROUP_IDS + 1 },
        (_, i) => `group${i + 1}`
      );
      const request = {
        userRole: "mqtt",
        groupIds: groupIds,
      };

      await assumeRoleExceedsMaxGroupIdsTest(user, request);
    });

    test("should throw error when invalid userRole is provided", async () => {
      const request = {
        userRole: "invalid_role",
        nodeIds: ["test-node-id"],
      };

      await assumeRoleInvalidUserRoleTest(user, request);
    });

    test("should throw error when both groupIds and nodeIds are provided", async () => {
      const request = {
        userRole: "mqtt",
        groupIds: ["group-id-1"],
        nodeIds: ["node-id-1"],
      };

      await assumeRoleBothGroupIdsAndNodeIdsTest(user, request);
    });

    test("should throw error when videostream role is used without nodeIds", async () => {
      const request = {
        userRole: "videostream",
      };

      await assumeRoleVideostreamWithoutNodeIdsTest(user, request);
    });

    test("should throw error when videostream role is used with empty nodeIds array", async () => {
      const request = {
        userRole: "videostream",
        nodeIds: [],
      };

      await assumeRoleVideostreamWithoutNodeIdsTest(user, request);
    });

    test("should throw error when videostream role is used with groupIds instead of nodeIds", async () => {
      const request = {
        userRole: "videostream",
        groupIds: ["group-id-1"],
      };

      await assumeRoleVideostreamWithoutNodeIdsTest(user, request);
    });

    test("should throw error when ESPUserRole.VIDEOSTREAM enum is used without nodeIds", async () => {
      const request = {
        userRole: ESPUserRole.VIDEOSTREAM,
      };

      await assumeRoleVideostreamWithoutNodeIdsTest(user, request);
    });

    test("should throw error when userRole is not provided (undefined)", async () => {
      const request = {} as any;

      await assumeRoleInvalidUserRoleTest(user, request);
    });

    test("should throw error when userRole is empty string", async () => {
      const request = {
        userRole: "",
        nodeIds: ["test-node-id"],
      };

      await assumeRoleInvalidUserRoleTest(user, request);
    });
  });

  describe("API Error Cases", () => {
    test("should handle API errors", async () => {
      // Mock the authorizeRequest method
      const mockAuthorizeRequest = jest.spyOn(
        ESPRMAPIManager,
        "authorizeRequest"
      );
      mockAuthorizeRequest.mockRejectedValue(MOCK_API_ERROR_RESPONSE);

      const request = {
        userRole: "mqtt",
        nodeIds: ["test-node-id"],
      };

      await assumeRoleAPIErrorTest(user, request);
    });
  });
});
