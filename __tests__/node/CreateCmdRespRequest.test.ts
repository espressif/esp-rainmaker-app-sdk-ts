/*
 * SPDX-FileCopyrightText: 2026 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import "../../src/methods/ESPRMNode";
import { ESPCmdRespRequest } from "../../src/ESPCmdRespRequest";
import { ESPRMNode } from "../../src/ESPRMNode";
import { ESPRMAPIManager } from "../../src/services/ESPRMAPIManager";
import { APIEndpoints, HTTPMethods } from "../../src/utils/constants";

describe("[Unit Test]: ESPRMNode - createCmdRespRequest() / getCmdRespRequestById()", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("createCmdRespRequest POSTs to user/nodes/cmd and returns the request id", async () => {
    const authorizeSpy = jest.spyOn(ESPRMAPIManager, "authorizeRequest");
    authorizeSpy.mockResolvedValue({
      request_id: "req-123",
      status: "success",
    });

    const node = new ESPRMNode({ id: "hub-node-1" } as never);
    const result = await node.createCmdRespRequest({
      cmdId: 4352,
      data: { request_payload: { cluster_id: "0x6" } },
      timeoutSeconds: 30,
    });

    expect(authorizeSpy).toHaveBeenCalledWith({
      url: APIEndpoints.USER_NODE_CMD,
      method: HTTPMethods.POST,
      data: {
        node_ids: ["hub-node-1"],
        cmd: 4352,
        data: { request_payload: { cluster_id: "0x6" } },
        timeout: 30,
      },
    });
    expect(result).toMatchObject({
      requestId: "req-123",
      status: "success",
    });
  });

  test("createCmdRespRequest maps 207 Multi-Status responses to camelCase", async () => {
    jest.spyOn(ESPRMAPIManager, "authorizeRequest").mockResolvedValue({
      request_id: "req-207",
      status: "partial_success",
      responses: [
        {
          node_ids: ["hub-node-1"],
          response: {
            status: "failure",
            error_code: "103035",
            description: "Node offline",
          },
        },
      ],
    });

    const node = new ESPRMNode({ id: "hub-node-1" } as never);
    const result = await node.createCmdRespRequest({
      cmdId: 4352,
      data: { request_payload: { cluster_id: "0x6" } },
    });

    expect(result).toEqual({
      requestId: "req-207",
      status: "partial_success",
      responses: [
        {
          nodeIds: ["hub-node-1"],
          response: {
            status: "failure",
            errorCode: "103035",
            description: "Node offline",
          },
        },
      ],
    });
  });

  test("getCmdRespRequestById GETs user/nodes/cmd by request id and maps the record", async () => {
    const authorizeSpy = jest.spyOn(ESPRMAPIManager, "authorizeRequest");
    authorizeSpy.mockResolvedValue({
      requests: [
        {
          request_id: "req-123",
          status: "success",
          node_id: "hub-node-1",
          device_status: 0,
          response_data: { status: "ok" },
        },
      ],
    });

    const node = new ESPRMNode({ id: "hub-node-1" } as never);
    const status = await node.getCmdRespRequestById("req-123");

    expect(authorizeSpy).toHaveBeenCalledWith({
      url: APIEndpoints.USER_NODE_CMD,
      method: HTTPMethods.GET,
      params: { request_id: "req-123", node_id: "hub-node-1" },
    });
    expect(status).toBeInstanceOf(ESPCmdRespRequest);
    expect(status).toMatchObject({
      requestId: "req-123",
      status: "success",
      nodeId: "hub-node-1",
      deviceStatus: 0,
      responseData: { status: "ok" },
    });
  });

  test("getCmdRespRequestById returns null when no record exists", async () => {
    jest
      .spyOn(ESPRMAPIManager, "authorizeRequest")
      .mockResolvedValue({ requests: [] });

    const node = new ESPRMNode({ id: "hub-node-1" } as never);
    await expect(node.getCmdRespRequestById("missing")).resolves.toBeNull();
  });
});
