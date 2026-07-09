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

describe("[Unit Test]: ESPRMUser - getFileById()", () => {
  let user: ESPRMUser;

  beforeEach(() => {
    user = new ESPRMUser(MOCK_USER_TOKENS);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("getFileById GETs user/file by file_id", async () => {
    const authorizeSpy = jest.spyOn(ESPRMAPIManager, "authorizeRequest");
    authorizeSpy.mockResolvedValue({
      file_details: [
        {
          file_id: "image/abc",
          file_name: "profile.png",
          file_url: "https://s3/download",
        },
      ],
    });

    const result = await user.getFileById("image/abc");

    expect(authorizeSpy).toHaveBeenCalledWith({
      url: APIEndpoints.USER_FILE,
      method: HTTPMethods.GET,
      params: {
        file_id: "image/abc",
        num_records: 1,
      },
    });
    expect(result).toBeInstanceOf(ESPFile);
    expect(result).toMatchObject({
      fileId: "image/abc",
      fileName: "profile.png",
      downloadUrl: "https://s3/download",
    });
  });

  test("getFileById returns null when no record exists", async () => {
    jest
      .spyOn(ESPRMAPIManager, "authorizeRequest")
      .mockResolvedValue({ file_details: [] });

    await expect(user.getFileById("missing")).resolves.toBeNull();
  });
});
