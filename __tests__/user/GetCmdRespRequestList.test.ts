/*
 * SPDX-FileCopyrightText: 2026 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import "../../src/methods/ESPRMUser";
import { ESPCmdRespRequest } from "../../src/ESPCmdRespRequest";
import { ESPRMUser } from "../../src/ESPRMUser";
import { ESPRMAPIManager } from "../../src/services/ESPRMAPIManager";
import { APIEndpoints, HTTPMethods } from "../../src/utils/constants";
import { MOCK_USER_TOKENS } from "../helpers/provision/utils";

jest.mock("../../src/services/ESPRMStorage/ESPRMStorage");

describe("[Unit Test]: ESPRMUser - getCmdRespRequestList()", () => {
  let user: ESPRMUser;

  beforeEach(() => {
    user = new ESPRMUser(MOCK_USER_TOKENS);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("getCmdRespRequestList GETs user/nodes/cmd by status for current user", async () => {
    const authorizeSpy = jest.spyOn(ESPRMAPIManager, "authorizeRequest");
    authorizeSpy.mockResolvedValue({
      requests: [
        {
          request_id: "req-9",
          status: "failure",
          node_id: "node-a",
        },
      ],
    });

    const result = await user.getCmdRespRequestList({ status: "failure" });

    expect(authorizeSpy).toHaveBeenCalledWith({
      url: APIEndpoints.USER_NODE_CMD,
      method: HTTPMethods.GET,
      params: { status: "failure" },
    });
    expect(result.requests[0]).toBeInstanceOf(ESPCmdRespRequest);
    expect(result.requests[0]).toMatchObject({
      requestId: "req-9",
      status: "failure",
      nodeId: "node-a",
    });
  });

  test("getCmdRespRequestList GETs by request_id without node_id", async () => {
    const authorizeSpy = jest.spyOn(ESPRMAPIManager, "authorizeRequest");
    authorizeSpy.mockResolvedValue({
      requests: [{ request_id: "req-only", status: "in_progress" }],
    });

    const result = await user.getCmdRespRequestList({ requestId: "req-only" });

    expect(authorizeSpy).toHaveBeenCalledWith({
      url: APIEndpoints.USER_NODE_CMD,
      method: HTTPMethods.GET,
      params: { request_id: "req-only" },
    });
    expect(result.requests[0]).toBeInstanceOf(ESPCmdRespRequest);
    expect(result.requests).toHaveLength(1);
  });
});
