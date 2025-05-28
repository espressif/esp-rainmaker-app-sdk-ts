/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMNode } from "../../../src/index";
import { ESPAPIResponse } from "../../../src/types/output";
import {
  ESPRawOTAUpdateResponse,
  ESPRawOTAUpdateStatusResponse,
} from "../../../src/types/ota";
import { StatusMessage } from "../../../src/utils/constants";

/**
 * OTA test values
 */
export const OTA_TEST_VALUES = {
  // empty OTA Job ID
  MOCK_EMPTY_JOB_ID: "",
  // undefined OTA Job ID
  MOCK_UNDEFINED_JOB_ID: undefined,
  // OTA Job ID
  MOCK_JOB_ID: "1234567890",
  // node ID
  MOCK_NODE_ID: "1234567890",
} as const;

/**
 * Mock node for OTA test
 */
export const MOCK_NODE: ESPRMNode = new ESPRMNode({
  id: OTA_TEST_VALUES.MOCK_NODE_ID,
  type: "esp32",
  availableTransports: {},
  transportOrder: [],
});

/**
 * Mock OTA response objects for testing
 */
export const OTA_MOCK_RESPONSES = {
  /**
   * Mock response when OTA update is available
   */
  CHECK_OTA_UPDATE_SUCCESS: {
    status: StatusMessage.SUCCESS,
    ota_available: true,
    description: "New firmware version available",
    fw_version: "v2.1.0",
    ota_job_id: "ota_job_12345",
    file_size: 1024000,
    url: "https://example.com/firmware.bin",
    file_md5: "1234567890",
    stream_id: "1234567890",
    metadata: {
      key: "value",
    },
  } as ESPRawOTAUpdateResponse,

  /**
   * Mock response when OTA update status is available
   */
  GET_OTA_UPDATE_STATUS_SUCCESS: {
    node_id: OTA_TEST_VALUES.MOCK_NODE_ID,
    status: StatusMessage.SUCCESS,
    additional_info: "OTA update completed successfully",
    timestamp: 1716883200,
  } as ESPRawOTAUpdateStatusResponse,

  /**
   * Mock response when OTA update is pushed
   */
  PUSH_OTA_UPDATE_SUCCESS: {
    status: StatusMessage.SUCCESS,
    description: "OTA update pushed successfully",
  } as ESPAPIResponse,
} as const;
