/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMAuth } from "../src/ESPRMAuth";
import { ESPRMUser } from "../src/ESPRMUser";
import { ESPRMGroup } from "../src/ESPRMGroup";
import { ESPRMNode } from "../src/ESPRMNode";
import {
  ESPAPIResponse,
  ESPPaginatedGroupsResponse,
  ESPPaginatedNodesResponse,
} from "../src/types/output";
import { configureAuthInstance } from "./utils/configureAuthInstance";
import { CreateGroupRequest } from "../src/types/input";
import { StatusMessage } from "../src/utils/constants";

// Note: For this test to work, the account must always contain at least one node.

describe("workflow: user node addition in newly created group", () => {
  let authInstance: ESPRMAuth;
  let userInstance: ESPRMUser;
  let getUserNodesResponse: ESPPaginatedNodesResponse;
  let getGroupsResponse: ESPPaginatedGroupsResponse;
  let node: ESPRMNode;
  let groups: ESPRMGroup[];
  let groupNamedTestGroup: ESPRMGroup;

  const NEW_GROUP_NAME = "Test Group";

  beforeAll(() => {
    authInstance = configureAuthInstance();
  });

  test("should login the user", async () => {
    userInstance = await authInstance.login(
      process.env.USERNAME!,
      process.env.PASSWORD!
    );
    expect(userInstance).toBeInstanceOf(ESPRMUser);
  });

  test("should fetch node associated with user", async () => {
    getUserNodesResponse = await userInstance.getUserNodes();
    node = getUserNodesResponse.nodes[0];
    expect(node).toBeDefined();
  });

  test(`should create a new group named ${NEW_GROUP_NAME}`, async () => {
    let groupInfo: CreateGroupRequest = {
      name: NEW_GROUP_NAME,
    };
    groupNamedTestGroup = await userInstance.createGroup(groupInfo);
    expect(groupNamedTestGroup.name).toBe(NEW_GROUP_NAME);
  });

  test(`should check ${NEW_GROUP_NAME} addition by fetching groups`, async () => {
    getGroupsResponse = await userInstance.getGroups({});
    groups = getGroupsResponse.groups;
    const newlyCreatedGroup = groups.find(
      (group) => group.name === NEW_GROUP_NAME
    );
    expect(newlyCreatedGroup).toBeDefined();
  });

  test(`should add node to newly created group named ${NEW_GROUP_NAME}`, async () => {
    const addNodesResponse: ESPAPIResponse = await groupNamedTestGroup.addNodes(
      [node.id]
    );
    expect(addNodesResponse.status).toBe(StatusMessage.SUCCESS);
  });

  test(`should check node addition in newly created group named ${NEW_GROUP_NAME}`, async () => {
    getGroupsResponse = await userInstance.getGroups({
      withNodeList: true,
    });
    groups = getGroupsResponse.groups;
    const newlyCreatedGroup = groups.find(
      (group) => group.name === NEW_GROUP_NAME
    );

    const isNodePresentInGroup = newlyCreatedGroup?.nodes?.includes(node.id);
    expect(isNodePresentInGroup).toBe(true);
  });

  afterAll(async () => {
    // Cleanup: Delete the newly created group
    if (groupNamedTestGroup) {
      const deleteGroupResponse: ESPAPIResponse =
        await groupNamedTestGroup.delete();
      expect(deleteGroupResponse.status).toBe(StatusMessage.SUCCESS);
    }
    // Logout the user
    if (userInstance) {
      const userLogoutResponse: ESPAPIResponse = await userInstance.logout();
      expect(userLogoutResponse.status).toBe(StatusMessage.SUCCESS);
    }
  });
});
