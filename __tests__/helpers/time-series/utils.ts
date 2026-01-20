/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMDeviceParam } from "../../../src/index";
import { ESPRMNode } from "../../../src/ESPRMNode";
import { ESPRMDeviceParamInterface } from "../../../src/types/node";
import { ParamProperties } from "../../../src/utils/constants";

/**
 * Setup mock node for time series test
 */

export const MOCK_NODE: ESPRMNode = new ESPRMNode({
  id: "test_node_id",
  type: "esp32",
  availableTransports: {},
  transportOrder: [],
});

/**
 * Mock device parameter for time series data
 */
export const MOCK_DEVICE_PARAM_FOR_TS = new ESPRMDeviceParam(
  {
    name: "mock_name",
    type: "mock_type",
    dataType: "int",
    properties: [ParamProperties.TS],
  } as unknown as ESPRMDeviceParamInterface,
  MOCK_NODE
);

/**
 * Mock device parameter for simple time series data
 */
export const MOCK_DEVICE_PARAM_FOR_SIMPLE_TS = new ESPRMDeviceParam(
  {
    name: "mock_name",
    type: "mock_type",
    dataType: "int",
    properties: [ParamProperties.SIMPLE_TS],
  } as unknown as ESPRMDeviceParamInterface,
  MOCK_NODE
);

/**
 * Mock time series data responses
 */
export const TS_MOCK_RESPONSES = {
  /**
   * Mock time series data response
   */
  GET_TS_DATA_SUCCESS: {
    ts_data: [
      {
        node_id: "node_id",
        params: [
          {
            param_name: "temperature",
            values: [
              {
                ts: 1628557200,
                val: 2,
              },
              {
                ts: 1628560800,
                val: -3,
              },
            ],
            num_records: 2,
          },
        ],
        next_id: "string",
        aggregate: "raw",
        timezone: "Asia/Calcutta",
        differential: true,
        reset_on_negative: false,
      },
    ],
  },

  /**
   * Mock simple time series data response
   */
  GET_SIMPLE_TS_DATA_SUCCESS: {
    ts_data: [
      {
        node_id: "node_id",
        params: [
          {
            param_name: "temperature",
            values: [
              {
                ts: 1628557200,
                val: 35.3,
              },
              {
                ts: 1628560800,
                val: 35.7,
              },
            ],
            num_records: 2,
          },
        ],
        next_id: "string",
      },
    ],
  },
};

/**
 * Custom parameter name value for time series data
 */
export const CUSTOM_PARAMETER_DATA = {
  NAME: "custom.device.parameter",
  DATA_TYPE: "int",
};
