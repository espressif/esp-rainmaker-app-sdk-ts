/*
 * SPDX-FileCopyrightText: 2026 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPCmdRespRequest } from "../../src/ESPCmdRespRequest";
import { ESPCmdRespRequestInterface } from "../../src/types/ESPModules";
import { ESPCmdRespRequestAPIRecord } from "../../src/types/output";

export function minimalCmdRespRequestData(
  overrides: Partial<ESPCmdRespRequestInterface> = {}
): ESPCmdRespRequestInterface {
  return {
    requestId: "req-1",
    status: "requested",
    nodeId: "node-a",
    deviceStatus: 0,
    statusDescription: "",
    requestData: {},
    requestTimestamp: 0,
    responseTimestamp: 0,
    expirationTimestamp: 0,
    cmdId: 0,
    ...overrides,
  };
}

export function createTestCmdRespRequest(
  overrides: Partial<ESPCmdRespRequestInterface> = {}
): ESPCmdRespRequest {
  return new ESPCmdRespRequest(minimalCmdRespRequestData(overrides));
}

export function minimalCmdRespAPIRecord(
  overrides: Partial<ESPCmdRespRequestAPIRecord> = {}
): ESPCmdRespRequestAPIRecord {
  return {
    request_id: "req-1",
    status: "requested",
    node_id: "node-a",
    device_status: 0,
    status_description: "",
    request_data: {},
    request_timestamp: 0,
    response_timestamp: 0,
    expiration_timestamp: 0,
    cmd: 0,
    ...overrides,
  };
}
