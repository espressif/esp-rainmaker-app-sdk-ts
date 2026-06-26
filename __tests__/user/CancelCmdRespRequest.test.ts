/*
 * SPDX-FileCopyrightText: 2026 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import "../../src/methods/ESPRMUser";
import { ESPRMUser } from "../../src/ESPRMUser";
import { ESPRMAPIManager } from "../../src/services/ESPRMAPIManager";
import { APIEndpoints, HTTPMethods } from "../../src/utils/constants";
import { MOCK_USER_TOKENS } from "../helpers/provision/utils";

jest.mock("../../src/services/ESPRMStorage/ESPRMStorage");

describe("[Unit Test]: ESPRMUser - cancelCmdRespRequest()", () => {
  let user: ESPRMUser;

  beforeEach(() => {
    user = new ESPRMUser(MOCK_USER_TOKENS);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("cancelCmdRespRequest DELETEs user/nodes/cmd with request_id only", async () => {
    const authorizeSpy = jest.spyOn(ESPRMAPIManager, "authorizeRequest");
    authorizeSpy.mockResolvedValue({
      status: "success",
      total_cancelled: "1",
    });

    await expect(
      user.cancelCmdRespRequest({ requestId: "req-123" })
    ).resolves.toEqual({
      status: "success",
      totalCancelled: "1",
    });

    expect(authorizeSpy).toHaveBeenCalledWith({
      url: APIEndpoints.USER_NODE_CMD,
      method: HTTPMethods.DELETE,
      params: { request_id: "req-123" },
    });
  });

  test("cancelCmdRespRequest DELETEs all pending commands for a node_id", async () => {
    const authorizeSpy = jest.spyOn(ESPRMAPIManager, "authorizeRequest");
    authorizeSpy.mockResolvedValue({
      status: "success",
      total_cancelled: "3",
    });

    await expect(
      user.cancelCmdRespRequest({ nodeId: "node-a" })
    ).resolves.toEqual({
      status: "success",
      totalCancelled: "3",
    });

    expect(authorizeSpy).toHaveBeenCalledWith({
      url: APIEndpoints.USER_NODE_CMD,
      method: HTTPMethods.DELETE,
      params: { node_id: "node-a" },
    });
  });

  test("cancelCmdRespRequest DELETEs with node_id and cmd_id filter", async () => {
    const authorizeSpy = jest.spyOn(ESPRMAPIManager, "authorizeRequest");
    authorizeSpy.mockResolvedValue({
      status: "success",
      total_cancelled: "2",
    });

    await expect(
      user.cancelCmdRespRequest({
        nodeId: "node-a",
        cmdId: 4352,
      })
    ).resolves.toEqual({
      status: "success",
      totalCancelled: "2",
    });

    expect(authorizeSpy).toHaveBeenCalledWith({
      url: APIEndpoints.USER_NODE_CMD,
      method: HTTPMethods.DELETE,
      params: { node_id: "node-a", cmd_id: 4352 },
    });
  });
});
