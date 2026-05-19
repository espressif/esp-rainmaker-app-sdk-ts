/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { transformNodesResponse } from "../../src/services/ESPRMHelpers/TransformNodesResponse";

const createValidNodeDetails = (nodeId: string): Record<string, any> => ({
  node_id: nodeId,
  node_type: "lightbulb",
  primary: true,
  status: {
    connectivity: {
      connected: true,
      timestamp: 1778497965713,
    },
  },
  config: {
    config_version: "2025-01-20",
    devices: [
      {
        name: "CCT Light",
        type: "esp.device.lightbulb",
        primary: "Power",
        params: [
          {
            name: "Name",
            type: "esp.param.name",
            data_type: "string",
            properties: ["read", "write"],
          },
          {
            name: "Power",
            type: "esp.param.power",
            data_type: "bool",
            properties: ["read", "write"],
          },
        ],
      },
    ],
    info: {
      fw_version: "1.0",
      model: "ESP-cct_lights",
      name: "ESP RainMaker cct_lights",
      type: "lightbulb",
    },
    services: [
      {
        name: "Time",
        type: "esp.service.time",
        params: [
          {
            name: "TZ",
            type: "esp.param.tz",
            data_type: "string",
            properties: ["read", "write"],
          },
        ],
      },
    ],
  },
  params: {
    "CCT Light": {
      Name: "Lightbulb",
      Power: true,
    },
    Time: {
      TZ: "Asia/Kolkata",
    },
  },
  metadata: {},
  tags: {},
});

describe("[Unit Test]: TransformNodesResponse", () => {
  describe("Partial failure handling", () => {
    test("should continue transforming remaining nodes when one node is malformed", () => {
      const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});

      const malformedNodeMissingInfo = {
        ...createValidNodeDetails("bad-node"),
        config: {
          config_version: "2025-01-20",
          devices: [],
          services: [],
        },
      };

      const response = transformNodesResponse(
        {
          node_details: [
            createValidNodeDetails("good-node-1"),
            malformedNodeMissingInfo,
            createValidNodeDetails("good-node-2"),
          ],
        },
        true
      );

      expect(response.map((node) => node.id)).toEqual([
        "good-node-1",
        "good-node-2",
      ]);
      expect(warnSpy).toHaveBeenCalledTimes(1);
      expect(warnSpy).toHaveBeenCalledWith(
        "Node transform partial failures",
        expect.arrayContaining([
          expect.objectContaining({
            nodeId: "bad-node",
            index: 1,
            reason: expect.any(String),
          }),
        ])
      );

      warnSpy.mockRestore();
    });
  });

  describe("Malformed payload combinations", () => {
    test("should skip node when config is missing", () => {
      const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});

      const nodeWithoutConfig = {
        ...createValidNodeDetails("node-without-config"),
        config: undefined,
      };

      const response = transformNodesResponse(
        {
          node_details: [
            createValidNodeDetails("good-node"),
            nodeWithoutConfig,
            createValidNodeDetails("good-node-2"),
          ],
        },
        true
      );

      expect(response.map((node) => node.id)).toEqual([
        "good-node",
        "good-node-2",
      ]);
      expect(warnSpy).toHaveBeenCalledWith(
        "Node transform partial failures",
        expect.arrayContaining([
          expect.objectContaining({
            nodeId: "node-without-config",
            reason: "Skipping node because config is missing",
          }),
        ])
      );

      warnSpy.mockRestore();
    });

    test("should not skip nodes for missing params combinations", () => {
      const allParamsMissing = {
        ...createValidNodeDetails("all-params-missing"),
        params: undefined,
      };

      const deviceParamsPresentServiceParamsMissing = {
        ...createValidNodeDetails("device-params-only"),
        config: {
          ...createValidNodeDetails("device-params-only").config,
          services: [
            {
              name: "Time",
              type: "esp.service.time",
              params: undefined,
            },
          ],
        },
      };

      const serviceParamsPresentDeviceParamsMissing = {
        ...createValidNodeDetails("service-params-only"),
        config: {
          ...createValidNodeDetails("service-params-only").config,
          devices: [
            {
              ...createValidNodeDetails("service-params-only").config.devices[0],
              params: undefined,
            },
          ],
        },
      };

      const partialDeviceParamsMissing = {
        ...createValidNodeDetails("partial-device-params-missing"),
        params: {
          "CCT Light": {
            Power: true,
          },
          Time: {
            TZ: "Asia/Kolkata",
          },
        },
      };

      const response = transformNodesResponse(
        {
          node_details: [
            allParamsMissing,
            deviceParamsPresentServiceParamsMissing,
            serviceParamsPresentDeviceParamsMissing,
            partialDeviceParamsMissing,
          ],
        },
        true
      );

      expect(response.map((node) => node.id)).toEqual([
        "all-params-missing",
        "device-params-only",
        "service-params-only",
        "partial-device-params-missing",
      ]);

      expect(
        response.find((node) => node.id === "all-params-missing")
      ).toBeDefined();

      expect(
        response.find((node) => node.id === "device-params-only")?.nodeConfig
          ?.services?.[0]?.params
      ).toEqual([]);

      expect(
        response.find((node) => node.id === "service-params-only")?.nodeConfig
          ?.devices?.[0]?.params
      ).toBeUndefined();

      expect(
        response
          .find((node) => node.id === "partial-device-params-missing")
          ?.nodeConfig?.devices?.[0]?.params?.find((param) => param.name === "Name")
          ?.value
      ).toBeUndefined();
    });

    test("should safely handle missing connectivity, devices, params, and services arrays", () => {
      const malformedButRecoverableNode = {
        ...createValidNodeDetails("node-with-missing-fields"),
        status: {},
        config: {
          config_version: "2025-01-20",
          devices: undefined,
          info: {
            fw_version: "1.0",
            model: "ESP-cct_lights",
            name: "ESP RainMaker cct_lights",
            type: "lightbulb",
          },
          services: [
            {
              name: "Time",
              type: "esp.service.time",
              params: undefined,
            },
          ],
        },
        params: undefined,
      };

      const response = transformNodesResponse(
        {
          node_details: [malformedButRecoverableNode],
        },
        true
      );

      expect(response).toHaveLength(1);
      expect(response[0].id).toBe("node-with-missing-fields");
      expect(response[0].connectivityStatus).toBeUndefined();
      expect(response[0].nodeConfig?.devices).toEqual([]);
      expect(response[0].nodeConfig?.services?.[0]?.params).toEqual([]);
      expect(response[0].availableTransports).toEqual({});
    });

    test("should isolate malformed nodes and continue processing mixed payload", () => {
      const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});

      const hardMalformedNode = {
        ...createValidNodeDetails("hard-malformed-node"),
        config: {
          config_version: "2025-01-20",
          devices: [],
          services: [],
        },
      };

      const recoverableNodeWithMissingFields = {
        ...createValidNodeDetails("recoverable-node"),
        status: {},
        config: {
          config_version: "2025-01-20",
          devices: undefined,
          info: {
            fw_version: "1.0",
            model: "ESP-cct_lights",
            name: "ESP RainMaker cct_lights",
            type: "lightbulb",
          },
          services: undefined,
        },
        params: undefined,
      };

      const response = transformNodesResponse(
        {
          node_details: [
            createValidNodeDetails("25dyjbiyqZXPwZ38pifVpk"),
            createValidNodeDetails("4827E278FFF0"),
            hardMalformedNode,
            recoverableNodeWithMissingFields,
            createValidNodeDetails("eiqv2YU5nyxySZdiw7Fitb"),
          ],
        },
        true
      );

      expect(response.map((node) => node.id)).toEqual([
        "25dyjbiyqZXPwZ38pifVpk",
        "4827E278FFF0",
        "recoverable-node",
        "eiqv2YU5nyxySZdiw7Fitb",
      ]);
      expect(response.find((node) => node.id === "recoverable-node")?.nodeConfig?.devices).toEqual([]);
      expect(response.find((node) => node.id === "recoverable-node")?.connectivityStatus).toBeUndefined();
      expect(warnSpy).toHaveBeenCalledWith(
        "Node transform partial failures",
        expect.arrayContaining([
          expect.objectContaining({
            nodeId: "hard-malformed-node",
          }),
        ])
      );

      warnSpy.mockRestore();
    });

    test("should not leak dynamic display name key across nodes", () => {
      const nodeWithNameParam = createValidNodeDetails("node-with-name-param");
      const nodeWithoutNameParam = createValidNodeDetails("node-without-name-param");

      nodeWithoutNameParam.config.devices[0].name = "RGB Light";
      nodeWithoutNameParam.config.devices[0].params = [
        {
          name: "Power",
          type: "esp.param.power",
          data_type: "bool",
          properties: ["read", "write"],
        },
      ];
      nodeWithoutNameParam.params = {
        "RGB Light": {
          Name: "This should not be used",
          Power: false,
        },
      };

      const response = transformNodesResponse(
        {
          node_details: [nodeWithNameParam, nodeWithoutNameParam],
        },
        true
      );

      expect(response[0].nodeConfig?.devices?.[0]?.displayName).toBe("Lightbulb");
      expect(response[1].nodeConfig?.devices?.[0]?.displayName).toBe("RGB Light");
    });
  });

  describe("Node IDs mode", () => {
    test("should transform node ids when withNodeDetails is false", () => {
      const response = transformNodesResponse(
        {
          nodes: ["node-1", "node-2"],
        },
        false
      );

      expect(response).toHaveLength(2);
      expect(response[0].id).toBe("node-1");
      expect(response[1].id).toBe("node-2");
    });
  });
});
