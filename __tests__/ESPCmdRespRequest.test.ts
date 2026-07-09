/*
 * SPDX-FileCopyrightText: 2026 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import "../src/methods/ESPCmdRespRequest";
import { ESPRMAPIManager } from "../src/services/ESPRMAPIManager";
import { APIEndpoints, HTTPMethods } from "../src/utils/constants";
import { createTestCmdRespRequest } from "./helpers/cmdRespFixtures";

describe("[Unit Test]: ESPCmdRespRequest", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("getStatus() GETs the latest record and updates the instance in place", async () => {
    const authorizeSpy = jest.spyOn(ESPRMAPIManager, "authorizeRequest");
    authorizeSpy.mockResolvedValue({
      requests: [
        {
          request_id: "req-1",
          status: "success",
          node_id: "node-a",
          response_data: { ok: true },
        },
      ],
    });

    const request = createTestCmdRespRequest({
      requestId: "req-1",
      status: "requested",
      nodeId: "node-a",
    });

    const updated = await request.getStatus();

    expect(authorizeSpy).toHaveBeenCalledWith({
      url: APIEndpoints.USER_NODE_CMD,
      method: HTTPMethods.GET,
      params: {
        request_id: "req-1",
        node_id: "node-a",
      },
    });
    expect(updated).toBe(request);
    expect(request.status).toBe("success");
    expect(request.responseData).toEqual({ ok: true });
  });

  test("getStatus() returns null when the backend has no record", async () => {
    jest
      .spyOn(ESPRMAPIManager, "authorizeRequest")
      .mockResolvedValue({ requests: [] });

    const request = createTestCmdRespRequest({
      requestId: "missing",
      status: "requested",
      nodeId: "",
    });

    await expect(request.getStatus()).resolves.toBeNull();
  });

  test("cancel() DELETEs the request and returns cancellation response", async () => {
    const authorizeSpy = jest.spyOn(ESPRMAPIManager, "authorizeRequest");
    authorizeSpy.mockResolvedValue({
      status: "success",
      total_cancelled: "1",
    });

    const request = createTestCmdRespRequest({
      requestId: "req-1",
      status: "requested",
      nodeId: "node-a",
    });

    const result = await request.cancel();

    expect(authorizeSpy).toHaveBeenCalledWith({
      url: APIEndpoints.USER_NODE_CMD,
      method: HTTPMethods.DELETE,
      params: {
        request_id: "req-1",
        node_id: "node-a",
      },
    });
    expect(result).toEqual({
      status: "success",
      totalCancelled: "1",
    });
    expect(request.status).toBe("cancelled");
  });
});
