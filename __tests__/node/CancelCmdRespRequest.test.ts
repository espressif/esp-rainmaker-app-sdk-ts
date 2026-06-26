/*
 * SPDX-FileCopyrightText: 2026 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import "../../src/methods/ESPRMNode";
import { ESPRMNode } from "../../src/ESPRMNode";
import { ESPRMAPIManager } from "../../src/services/ESPRMAPIManager";
import { APIEndpoints, HTTPMethods } from "../../src/utils/constants";

describe("[Unit Test]: ESPRMNode - cancelCmdRespRequest()", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("cancelCmdRespRequest DELETEs user/nodes/cmd with request_id parameter", async () => {
    const authorizeSpy = jest.spyOn(ESPRMAPIManager, "authorizeRequest");
    authorizeSpy.mockResolvedValue({
      status: "success",
      total_cancelled: "1",
    });

    const node = new ESPRMNode({ id: "hub-node-1" } as never);
    await expect(
      node.cancelCmdRespRequest({
        requestId: "req-123",
      })
    ).resolves.toEqual({
      status: "success",
      totalCancelled: "1",
    });

    expect(authorizeSpy).toHaveBeenCalledWith({
      url: APIEndpoints.USER_NODE_CMD,
      method: HTTPMethods.DELETE,
      params: {
        request_id: "req-123",
        node_id: "hub-node-1",
      },
    });
  });

  test("cancelCmdRespRequest DELETEs user/nodes/cmd with node_id to cancel all pending", async () => {
    const authorizeSpy = jest.spyOn(ESPRMAPIManager, "authorizeRequest");
    authorizeSpy.mockResolvedValue({
      status: "success",
      total_cancelled: "3",
    });

    const node = new ESPRMNode({ id: "hub-node-1" } as never);
    await expect(node.cancelCmdRespRequest({})).resolves.toEqual({
      status: "success",
      totalCancelled: "3",
    });

    expect(authorizeSpy).toHaveBeenCalledWith({
      url: APIEndpoints.USER_NODE_CMD,
      method: HTTPMethods.DELETE,
      params: {
        node_id: "hub-node-1",
      },
    });
  });

  test("cancelCmdRespRequest DELETEs user/nodes/cmd with node_id and cmd_id filter", async () => {
    const authorizeSpy = jest.spyOn(ESPRMAPIManager, "authorizeRequest");
    authorizeSpy.mockResolvedValue({
      status: "success",
      total_cancelled: "2",
    });

    const node = new ESPRMNode({ id: "hub-node-1" } as never);
    await expect(
      node.cancelCmdRespRequest({
        cmdId: 4352,
      })
    ).resolves.toEqual({
      status: "success",
      totalCancelled: "2",
    });

    expect(authorizeSpy).toHaveBeenCalledWith({
      url: APIEndpoints.USER_NODE_CMD,
      method: HTTPMethods.DELETE,
      params: {
        node_id: "hub-node-1",
        cmd_id: 4352,
      },
    });
  });

  test("cancelCmdRespRequest DELETEs with node context scoped to this node", async () => {
    const authorizeSpy = jest.spyOn(ESPRMAPIManager, "authorizeRequest");
    authorizeSpy.mockResolvedValue({
      status: "success",
      total_cancelled: "1",
    });

    const node = new ESPRMNode({ id: "hub-node-1" } as never);
    await expect(
      node.cancelCmdRespRequest({
        nodeId: "hub-node-2",
        cmdId: 5000,
      })
    ).resolves.toEqual({
      status: "success",
      totalCancelled: "1",
    });

    expect(authorizeSpy).toHaveBeenCalledWith({
      url: APIEndpoints.USER_NODE_CMD,
      method: HTTPMethods.DELETE,
      params: {
        node_id: "hub-node-1",
        cmd_id: 5000,
      },
    });
  });

  test("cancelCmdRespRequest completes when no pending commands are found", async () => {
    jest.spyOn(ESPRMAPIManager, "authorizeRequest").mockResolvedValue({
      status: "success",
      total_cancelled: "0",
    });

    const node = new ESPRMNode({ id: "hub-node-1" } as never);
    await expect(
      node.cancelCmdRespRequest({
        requestId: "non-existent",
      })
    ).resolves.toEqual({
      status: "success",
      totalCancelled: "0",
    });
  });
});
