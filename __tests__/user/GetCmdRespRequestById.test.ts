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

describe("[Unit Test]: ESPRMUser - getCmdRespRequestById()", () => {
  let user: ESPRMUser;

  beforeEach(() => {
    user = new ESPRMUser(MOCK_USER_TOKENS);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("getCmdRespRequestById GETs user/nodes/cmd by request_id alone", async () => {
    const authorizeSpy = jest.spyOn(ESPRMAPIManager, "authorizeRequest");
    authorizeSpy.mockResolvedValue({
      requests: [
        {
          request_id: "req-123",
          status: "success",
          node_id: "node-a",
        },
        {
          request_id: "req-123",
          status: "in_progress",
          node_id: "node-b",
        },
      ],
    });

    const result = await user.getCmdRespRequestById("req-123");

    expect(authorizeSpy).toHaveBeenCalledWith({
      url: APIEndpoints.USER_NODE_CMD,
      method: HTTPMethods.GET,
      params: { request_id: "req-123" },
    });
    expect(result).toHaveLength(2);
    expect(result[0]).toBeInstanceOf(ESPCmdRespRequest);
    expect(result[0]).toMatchObject({
      requestId: "req-123",
      status: "success",
      nodeId: "node-a",
    });
    expect(result[1]).toMatchObject({
      requestId: "req-123",
      status: "in_progress",
      nodeId: "node-b",
    });
  });

  test("getCmdRespRequestById GETs with optional node_id scope", async () => {
    const authorizeSpy = jest.spyOn(ESPRMAPIManager, "authorizeRequest");
    authorizeSpy.mockResolvedValue({
      requests: [
        {
          request_id: "req-123",
          status: "in_progress",
          node_id: "node-b",
        },
      ],
    });

    const result = await user.getCmdRespRequestById("req-123", "node-b");

    expect(authorizeSpy).toHaveBeenCalledWith({
      url: APIEndpoints.USER_NODE_CMD,
      method: HTTPMethods.GET,
      params: {
        request_id: "req-123",
        node_id: "node-b",
      },
    });
    expect(result).toHaveLength(1);
    expect(result[0]).toBeInstanceOf(ESPCmdRespRequest);
    expect(result[0]).toMatchObject({
      requestId: "req-123",
      status: "in_progress",
      nodeId: "node-b",
    });
  });

  test("getCmdRespRequestById returns empty array when no record exists", async () => {
    jest
      .spyOn(ESPRMAPIManager, "authorizeRequest")
      .mockResolvedValue({ requests: [] });

    await expect(user.getCmdRespRequestById("missing")).resolves.toEqual([]);
  });
});
