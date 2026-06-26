/*
 * SPDX-FileCopyrightText: 2026 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  buildCmdRespRequestBody,
  createCmdRespRequestCancelParams,
  createCmdRespRequestListParams,
  createCmdRespRequestPaginatedResult,
  transformCmdRespRequest,
  transformCmdRespSendNodeResponse,
  transformCmdRespSendResponse,
  transformCmdRespSendResponseEntry,
} from "../../src/services/ESPRMHelpers/ESPCmdRespHelpers";
import {
  APICallValidationErrorCodes,
  CommandResponseConstants,
} from "../../src/utils/constants";
import { ESPAPICallValidationError } from "../../src/utils/error/Error";
import {
  createTestCmdRespRequest,
  minimalCmdRespAPIRecord,
} from "./cmdRespFixtures";

describe("[Unit Test]: ESPCmdRespHelpers", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("transformCmdRespRequest()", () => {
    test("maps API record fields to the SDK shape", () => {
      const result = transformCmdRespRequest({
        request_id: "req-1",
        status: "success",
        node_id: "node-a",
        device_status: 0,
        status_description: "ok",
        request_data: { brightness: 10 },
        response_data: { brightness: 10 },
        request_timestamp: 1000,
        response_timestamp: 2000,
        expiration_timestamp: 3000,
        cmd: 42,
      });

      expect(result).toMatchObject({
        requestId: "req-1",
        status: "success",
        nodeId: "node-a",
        deviceStatus: 0,
        statusDescription: "ok",
        requestData: { brightness: 10 },
        responseData: { brightness: 10 },
        requestTimestamp: 1000,
        responseTimestamp: 2000,
        expirationTimestamp: 3000,
        cmdId: 42,
      });
    });

    test("maps only required fields when optionals are omitted", () => {
      const result = transformCmdRespRequest(
        minimalCmdRespAPIRecord({
          request_id: "req-min",
          status: "requested",
        })
      );

      expect(result).toMatchObject({
        requestId: "req-min",
        status: "requested",
      });
    });
  });

  describe("transformCmdRespSendNodeResponse()", () => {
    test("maps API per-node response fields to the SDK shape", () => {
      const result = transformCmdRespSendNodeResponse({
        status: "failure",
        error_code: "103035",
        description: "Node offline",
      });

      expect(result).toEqual({
        status: "failure",
        errorCode: "103035",
        description: "Node offline",
      });
    });

    test("omits optional fields when not present in the API response", () => {
      const result = transformCmdRespSendNodeResponse({
        status: "success",
      });

      expect(result).toEqual({ status: "success" });
      expect(result).not.toHaveProperty("errorCode");
      expect(result).not.toHaveProperty("description");
    });
  });

  describe("transformCmdRespSendResponseEntry()", () => {
    test("maps API 207 entry fields to the SDK shape", () => {
      const result = transformCmdRespSendResponseEntry({
        node_ids: ["node-a", "node-b"],
        response: {
          status: "failure",
          error_code: "103035",
          description: "Node offline",
        },
      });

      expect(result).toEqual({
        nodeIds: ["node-a", "node-b"],
        response: {
          status: "failure",
          errorCode: "103035",
          description: "Node offline",
        },
      });
    });
  });

  describe("transformCmdRespSendResponse()", () => {
    test("maps API send response fields to the SDK shape", () => {
      const result = transformCmdRespSendResponse({
        request_id: "req-1",
        status: "success",
      });

      expect(result).toEqual({
        requestId: "req-1",
        status: "success",
      });
    });

    test("maps 207 Multi-Status responses to camelCase entries", () => {
      const result = transformCmdRespSendResponse({
        request_id: "req-1",
        status: "partial_success",
        responses: [
          {
            node_ids: ["node-a", "node-b"],
            response: {
              status: "failure",
              error_code: "103035",
              description: "Node offline",
            },
          },
        ],
      });

      expect(result).toEqual({
        requestId: "req-1",
        status: "partial_success",
        responses: [
          {
            nodeIds: ["node-a", "node-b"],
            response: {
              status: "failure",
              errorCode: "103035",
              description: "Node offline",
            },
          },
        ],
      });
    });

    test("omits responses when absent from the API payload", () => {
      const result = transformCmdRespSendResponse({
        request_id: "req-1",
        status: "success",
      });

      expect(result).not.toHaveProperty("responses");
    });
  });

  describe("buildCmdRespRequestBody()", () => {
    test("passes object data through unchanged", () => {
      const body = buildCmdRespRequestBody({
        nodeIds: ["node-1"],
        cmdId: 1,
        data: { brightness: 10 },
      });

      expect(body).toEqual({
        node_ids: ["node-1"],
        cmd: 1,
        data: { brightness: 10 },
      });
    });

    test("passes through string data unchanged", () => {
      const body = buildCmdRespRequestBody({
        nodeIds: ["node-1"],
        cmdId: 1,
        data: '{"brightness":10}',
        isBase64: true,
        override: true,
        timeoutSeconds: -1,
      });

      expect(body).toEqual({
        node_ids: ["node-1"],
        cmd: 1,
        data: '{"brightness":10}',
        is_base64: true,
        override: true,
        timeout: -1,
      });
    });

    test("omits optional fields when not provided", () => {
      const body = buildCmdRespRequestBody({
        nodeIds: ["node-1"],
        cmdId: 1,
        data: "payload",
      });

      expect(body).toEqual({
        node_ids: ["node-1"],
        cmd: 1,
        data: "payload",
      });
      expect(body).not.toHaveProperty("timeout");
      expect(body).not.toHaveProperty("is_base64");
      expect(body).not.toHaveProperty("override");
    });

    test("accepts a provided cmd id in range", () => {
      const body = buildCmdRespRequestBody({
        nodeIds: ["node-1"],
        cmdId: 0,
        data: "payload",
      });

      expect(body.cmd).toBe(0);
    });

    test("accepts the maximum cmd id", () => {
      const body = buildCmdRespRequestBody({
        nodeIds: ["node-1"],
        cmdId: CommandResponseConstants.MAX_CMD_ID,
        data: "payload",
      });

      expect(body.cmd).toBe(CommandResponseConstants.MAX_CMD_ID);
    });

    test("rejects an invalid provided cmd id", () => {
      expect(() =>
        buildCmdRespRequestBody({
          nodeIds: ["node-1"],
          cmdId: 70000,
          data: "payload",
        })
      ).toThrow(
        new ESPAPICallValidationError(
          APICallValidationErrorCodes.INVALID_COMMAND_ID
        )
      );
    });

    test("rejects a negative cmd id", () => {
      expect(() =>
        buildCmdRespRequestBody({
          nodeIds: ["node-1"],
          cmdId: -1,
          data: "payload",
        })
      ).toThrow(ESPAPICallValidationError);
    });

    test("rejects a non-integer cmd id", () => {
      expect(() =>
        buildCmdRespRequestBody({
          nodeIds: ["node-1"],
          cmdId: 1.5,
          data: "payload",
        })
      ).toThrow(ESPAPICallValidationError);
    });

    test("rejects a missing cmd id", () => {
      expect(() =>
        buildCmdRespRequestBody({
          nodeIds: ["node-1", "node-2"],
          data: "payload",
        } as never)
      ).toThrow(ESPAPICallValidationError);
    });

    test("rejects empty node ids", () => {
      expect(() =>
        buildCmdRespRequestBody({
          nodeIds: [],
          cmdId: 1,
          data: "payload",
        })
      ).toThrow(
        new ESPAPICallValidationError(
          APICallValidationErrorCodes.INVALID_COMMAND_NODE_IDS
        )
      );
    });

    test("rejects more than 25 node ids", () => {
      const nodeIds = Array.from({ length: 26 }, (_, index) => `node-${index}`);

      expect(() =>
        buildCmdRespRequestBody({
          nodeIds,
          cmdId: 1,
          data: "payload",
        })
      ).toThrow(ESPAPICallValidationError);
    });

    test("rejects duplicate node ids", () => {
      expect(() =>
        buildCmdRespRequestBody({
          nodeIds: ["node-1", "node-1"],
          cmdId: 1,
          data: "payload",
        })
      ).toThrow(
        new ESPAPICallValidationError(
          APICallValidationErrorCodes.DUPLICATE_COMMAND_NODE_IDS
        )
      );
    });

    test("accepts the maximum number of node ids", () => {
      const nodeIds = Array.from(
        { length: CommandResponseConstants.MAX_NODE_IDS },
        (_, index) => `node-${index}`
      );

      const body = buildCmdRespRequestBody({
        nodeIds,
        cmdId: 1,
        data: "payload",
      });

      expect(body.node_ids).toEqual(nodeIds);
    });

    test("rejects data larger than the maximum length", () => {
      const oversizedData = "a".repeat(
        CommandResponseConstants.MAX_DATA_LENGTH + 1
      );

      expect(() =>
        buildCmdRespRequestBody({
          nodeIds: ["node-1"],
          cmdId: 1,
          data: oversizedData,
        })
      ).toThrow(
        new ESPAPICallValidationError(
          APICallValidationErrorCodes.COMMAND_DATA_TOO_LARGE
        )
      );
    });

    test("accepts data at the maximum length", () => {
      const maxData = "a".repeat(CommandResponseConstants.MAX_DATA_LENGTH);

      const body = buildCmdRespRequestBody({
        nodeIds: ["node-1"],
        cmdId: 1,
        data: maxData,
      });

      expect(body.data).toHaveLength(CommandResponseConstants.MAX_DATA_LENGTH);
    });

    test("accepts valid timeout values", () => {
      const minTimeoutBody = buildCmdRespRequestBody({
        nodeIds: ["node-1"],
        cmdId: 1,
        data: "payload",
        timeoutSeconds: CommandResponseConstants.MIN_TIMEOUT_SECONDS,
      });
      const maxTimeoutBody = buildCmdRespRequestBody({
        nodeIds: ["node-1"],
        cmdId: 1,
        data: "payload",
        timeoutSeconds: CommandResponseConstants.MAX_TIMEOUT_SECONDS,
      });

      expect(minTimeoutBody.timeout).toBe(
        CommandResponseConstants.MIN_TIMEOUT_SECONDS
      );
      expect(maxTimeoutBody.timeout).toBe(
        CommandResponseConstants.MAX_TIMEOUT_SECONDS
      );
    });

    test("rejects invalid timeout values", () => {
      expect(() =>
        buildCmdRespRequestBody({
          nodeIds: ["node-1"],
          cmdId: 1,
          data: "payload",
          timeoutSeconds: 0,
        })
      ).toThrow(
        new ESPAPICallValidationError(
          APICallValidationErrorCodes.INVALID_COMMAND_TIMEOUT
        )
      );
    });

    test("rejects a timeout above the maximum", () => {
      expect(() =>
        buildCmdRespRequestBody({
          nodeIds: ["node-1"],
          cmdId: 1,
          data: "payload",
          timeoutSeconds: CommandResponseConstants.MAX_TIMEOUT_SECONDS + 1,
        })
      ).toThrow(ESPAPICallValidationError);
    });

    test("rejects a non-integer timeout", () => {
      expect(() =>
        buildCmdRespRequestBody({
          nodeIds: ["node-1"],
          cmdId: 1,
          data: "payload",
          timeoutSeconds: 1.5,
        })
      ).toThrow(ESPAPICallValidationError);
    });
  });

  describe("createCmdRespRequestListParams()", () => {
    test("maps filter params to snake_case query params", () => {
      expect(
        createCmdRespRequestListParams({
          requestId: "req-1",
          nodeId: "node-a",
          status: "success",
          startTime: 1000,
          endTime: 2000,
          cmdId: 1,
          descOrder: false,
          resultCount: 10,
        })
      ).toEqual({
        request_id: "req-1",
        node_id: "node-a",
        status: "success",
        start_time: 1000,
        end_time: 2000,
        cmd_id: 1,
        desc_order: false,
        num_records: 10,
      });
    });

    test("omits undefined filter params", () => {
      expect(createCmdRespRequestListParams({ nodeId: "node-a" })).toEqual({
        node_id: "node-a",
      });
    });

    test("includes start_id when provided", () => {
      expect(
        createCmdRespRequestListParams({ status: "success" }, "cursor-9")
      ).toEqual({
        status: "success",
        start_id: "cursor-9",
      });
    });
  });

  describe("createCmdRespRequestCancelParams()", () => {
    test("maps cancellation filters to snake_case query params", () => {
      expect(
        createCmdRespRequestCancelParams({
          requestId: "req-1",
          nodeId: "node-a",
          cmdId: 42,
        })
      ).toEqual({
        request_id: "req-1",
        node_id: "node-a",
        cmd_id: 42,
      });
    });

    test("omits undefined cancellation filters", () => {
      expect(createCmdRespRequestCancelParams({ requestId: "req-1" })).toEqual(
        { request_id: "req-1" }
      );
      expect(createCmdRespRequestCancelParams({ nodeId: "node-a" })).toEqual({
        node_id: "node-a",
      });
      expect(createCmdRespRequestCancelParams({})).toEqual({});
    });
  });

  describe("createCmdRespRequestPaginatedResult()", () => {
    const requests = [
      createTestCmdRespRequest({
        requestId: "req-1",
        status: "success",
      }),
    ];

    test("returns requests without pagination when nextId is absent", () => {
      expect(
        createCmdRespRequestPaginatedResult(requests, null)
      ).toEqual({
        requests,
        hasNext: false,
      });
    });

    test("exposes fetchNext when nextId and fetchNextPage are provided", async () => {
      const fetchNextPage = jest.fn().mockResolvedValue({
        requests: [{ requestId: "req-2", status: "success" }],
        hasNext: false,
      });

      const result = createCmdRespRequestPaginatedResult(
        requests,
        "cursor-2",
        fetchNextPage
      );

      expect(result.hasNext).toBe(true);
      await result.fetchNext!();

      expect(fetchNextPage).toHaveBeenCalledWith("cursor-2");
    });
  });
});
