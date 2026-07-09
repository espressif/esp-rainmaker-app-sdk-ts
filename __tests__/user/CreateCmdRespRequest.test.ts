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

describe("[Unit Test]: ESPRMUser - createCmdRespRequest()", () => {
  let user: ESPRMUser;

  beforeEach(() => {
    user = new ESPRMUser(MOCK_USER_TOKENS);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("createCmdRespRequest POSTs up to 25 node_ids with API-shaped body", async () => {
    const authorizeSpy = jest.spyOn(ESPRMAPIManager, "authorizeRequest");
    authorizeSpy.mockResolvedValue({
      request_id: "req-multi",
      status: "success",
    });

    const result = await user.createCmdRespRequest({
      nodeIds: ["node-a", "node-b"],
      cmdId: 42,
      data: { brightness: 10 },
      override: true,
    });

    expect(authorizeSpy).toHaveBeenCalledWith({
      url: APIEndpoints.USER_NODE_CMD,
      method: HTTPMethods.POST,
      data: {
        node_ids: ["node-a", "node-b"],
        cmd: 42,
        data: { brightness: 10 },
        override: true,
      },
    });
    expect(result).toMatchObject({ requestId: "req-multi", status: "success" });
  });

  test("createCmdRespRequest maps 207 Multi-Status responses to camelCase", async () => {
    jest.spyOn(ESPRMAPIManager, "authorizeRequest").mockResolvedValue({
      request_id: "req-207",
      status: "partial_success",
      responses: [
        {
          node_ids: ["node-a"],
          response: {
            status: "failure",
            error_code: "103035",
            description: "Node offline",
          },
        },
      ],
    });

    const result = await user.createCmdRespRequest({
      nodeIds: ["node-a"],
      cmdId: 42,
      data: { brightness: 10 },
    });

    expect(result).toEqual({
      requestId: "req-207",
      status: "partial_success",
      responses: [
        {
          nodeIds: ["node-a"],
          response: {
            status: "failure",
            errorCode: "103035",
            description: "Node offline",
          },
        },
      ],
    });
  });
});
