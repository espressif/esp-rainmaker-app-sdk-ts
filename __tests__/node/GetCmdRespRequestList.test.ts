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

describe("[Unit Test]: ESPRMNode - getCmdRespRequestList()", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("getCmdRespRequestList GETs user/nodes/cmd with node_id and status filter", async () => {
    const authorizeSpy = jest.spyOn(ESPRMAPIManager, "authorizeRequest");
    authorizeSpy.mockResolvedValue({
      requests: [
        {
          request_id: "req-1",
          status: "success",
          node_id: "hub-node-1",
          cmd: 1,
        },
      ],
      next_id: "cursor-2",
    });

    const node = new ESPRMNode({ id: "hub-node-1" } as never);
    const result = await node.getCmdRespRequestList({
      status: "success",
      cmdId: 1,
      descOrder: false,
      resultCount: 25,
    });

    expect(authorizeSpy).toHaveBeenCalledWith({
      url: APIEndpoints.USER_NODE_CMD,
      method: HTTPMethods.GET,
      params: {
        node_id: "hub-node-1",
        status: "success",
        cmd_id: 1,
        desc_order: false,
        num_records: 25,
      },
    });
    expect(result.requests[0]).toBeInstanceOf(ESPCmdRespRequest);
    expect(result.requests).toHaveLength(1);
    expect(result.hasNext).toBe(true);
    expect(result.fetchNext).toBeDefined();
  });

  test("getCmdRespRequestList GETs history by start_time and end_time", async () => {
    const authorizeSpy = jest.spyOn(ESPRMAPIManager, "authorizeRequest");
    authorizeSpy.mockResolvedValue({ requests: [] });

    const node = new ESPRMNode({ id: "hub-node-1" } as never);
    await node.getCmdRespRequestList({
      startTime: 1775215200,
      endTime: 1775215500,
    });

    expect(authorizeSpy).toHaveBeenCalledWith({
      url: APIEndpoints.USER_NODE_CMD,
      method: HTTPMethods.GET,
      params: {
        node_id: "hub-node-1",
        start_time: 1775215200,
        end_time: 1775215500,
      },
    });
  });

  test("fetchNext passes start_id for pagination", async () => {
    const authorizeSpy = jest.spyOn(ESPRMAPIManager, "authorizeRequest");
    authorizeSpy
      .mockResolvedValueOnce({
        requests: [{ request_id: "req-1", status: "requested" }],
        next_id: "cursor-2",
      })
      .mockResolvedValueOnce({
        requests: [{ request_id: "req-2", status: "success" }],
      });

    const node = new ESPRMNode({ id: "hub-node-1" } as never);
    const firstPage = await node.getCmdRespRequestList({ status: "requested" });
    const secondPage = await firstPage.fetchNext!();

    expect(authorizeSpy).toHaveBeenNthCalledWith(2, {
      url: APIEndpoints.USER_NODE_CMD,
      method: HTTPMethods.GET,
      params: {
        node_id: "hub-node-1",
        status: "requested",
        start_id: "cursor-2",
      },
    });
    expect(secondPage.requests[0].requestId).toBe("req-2");
    expect(secondPage.hasNext).toBe(false);
  });
});
