/*
 * SPDX-FileCopyrightText: 2026 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ESPCmdRespDataError,
  ESPCmdRespDeviceStatus,
  ESPCmdRespRequestInterface,
} from "./types/ESPModules";

/**
 * Represents a command-response request in the ESP RainMaker SDK.
 *
 * Returned by {@link ESPRMNode.createCmdRespRequest}, {@link ESPRMUser.createCmdRespRequest},
 * and list/lookup helpers. Use {@link getStatus} to fetch the latest state from the cloud
 * and {@link cancel} to cancel a pending request.
 */
export class ESPCmdRespRequest implements ESPCmdRespRequestInterface {
  /** Current status of the command-response request. */
  status!: ESPCmdRespRequestInterface["status"];

  /** The unique request id returned when the command was queued. */
  requestId!: string;

  /** Target node id. */
  nodeId!: string;

  /** Device-reported status code. */
  deviceStatus!: ESPCmdRespDeviceStatus;

  /** Human-readable status description from the device or backend. */
  statusDescription!: string;

  /** Payload sent with the command request. */
  requestData!: Record<string, unknown> | string;

  /** Epoch timestamp when the request was created. */
  requestTimestamp!: number;

  /** Epoch timestamp when the device responded. */
  responseTimestamp!: number;

  /** Epoch timestamp when the request expires. */
  expirationTimestamp!: number;

  /** Command id associated with this request. */
  cmdId!: number;

  /** Payload returned by the device, when the request has completed. */
  responseData?: Record<string, unknown> | string | null;

  /**
   * Present only when the stored request payload could not be deserialized.
   * When set, `requestData` should be treated as absent or null.
   */
  requestDataError?: ESPCmdRespDataError;

  /**
   * Present only when the stored response payload could not be deserialized.
   * When set, `responseData` should be treated as absent or null.
   */
  responseDataError?: ESPCmdRespDataError;

  /** When true, the request data was base64-encoded. */
  isBase64?: boolean;

  /** Username of the user who created this request. */
  userName?: string;

  /** When true, the request has no expiry and waits indefinitely for a device response. */
  indefiniteTimeout?: boolean;

  /**
   * Creates an instance of `ESPCmdRespRequest`.
   *
   * @param data - Command-response request fields.
   */
  constructor(data: ESPCmdRespRequestInterface) {
    this.applyUpdate(data);
  }

  /**
   * Updates this instance in place from command-response request fields.
   *
   * @param data - Command-response request fields.
   */
  applyUpdate(data: ESPCmdRespRequestInterface): void {
    this.requestId = data.requestId;
    this.status = data.status;
    this.nodeId = data.nodeId;
    this.deviceStatus = data.deviceStatus;
    this.statusDescription = data.statusDescription;
    this.requestData = data.requestData;
    this.responseData = data.responseData;
    this.requestDataError = data.requestDataError;
    this.responseDataError = data.responseDataError;
    this.isBase64 = data.isBase64;
    this.userName = data.userName;
    this.indefiniteTimeout = data.indefiniteTimeout;
    this.requestTimestamp = data.requestTimestamp;
    this.responseTimestamp = data.responseTimestamp;
    this.expirationTimestamp = data.expirationTimestamp;
    this.cmdId = data.cmdId;
  }
}
