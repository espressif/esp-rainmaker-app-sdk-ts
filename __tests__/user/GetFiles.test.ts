/*
 * SPDX-FileCopyrightText: 2026 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import "../../src/methods/ESPRMUser";
import { ESPFile } from "../../src/ESPFile";
import { ESPRMUser } from "../../src/ESPRMUser";
import { ESPRMAPIManager } from "../../src/services/ESPRMAPIManager";
import { APIEndpoints, HTTPMethods } from "../../src/utils/constants";
import { MOCK_USER_TOKENS } from "../helpers/provision/utils";

jest.mock("../../src/services/ESPRMStorage/ESPRMStorage");

describe("[Unit Test]: ESPRMUser - getFiles()", () => {
  let user: ESPRMUser;

  beforeEach(() => {
    user = new ESPRMUser(MOCK_USER_TOKENS);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("getFiles GETs user/file with filters", async () => {
    const authorizeSpy = jest.spyOn(ESPRMAPIManager, "authorizeRequest");
    authorizeSpy.mockResolvedValue({
      file_details: [
        {
          file_id: "image/1",
          file_name: "profile.png",
          entity_type: "node",
          entity_id: "node-1",
        },
      ],
      next_id: "cursor-1",
    });

    const result = await user.getFiles({
      entityType: "node",
      entityId: "node-1",
      resultCount: 10,
    });

    expect(authorizeSpy).toHaveBeenCalledWith({
      url: APIEndpoints.USER_FILE,
      method: HTTPMethods.GET,
      params: {
        entity_type: "node",
        entity_id: "node-1",
        num_records: 10,
      },
    });
    expect(result.files[0]).toBeInstanceOf(ESPFile);
    expect(result.hasNext).toBe(true);
    expect(result.fetchNext).toBeDefined();
  });
});
