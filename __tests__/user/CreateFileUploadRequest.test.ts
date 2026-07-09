/*
 * SPDX-FileCopyrightText: 2026 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import "../../src/methods/ESPRMUser";
import { ESPFileUploadRequest } from "../../src/ESPFileUploadRequest";
import { ESPRMUser } from "../../src/ESPRMUser";
import { ESPRMAPIManager } from "../../src/services/ESPRMAPIManager";
import { APIEndpoints, HTTPMethods } from "../../src/utils/constants";
import { MOCK_USER_TOKENS } from "../helpers/provision/utils";

jest.mock("../../src/services/ESPRMStorage/ESPRMStorage");

describe("[Unit Test]: ESPRMUser - createFileUploadRequest()", () => {
  let user: ESPRMUser;

  beforeEach(() => {
    user = new ESPRMUser(MOCK_USER_TOKENS);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("createFileUploadRequest GETs upload_request and stores confirm params", async () => {
    const authorizeSpy = jest.spyOn(ESPRMAPIManager, "authorizeRequest");
    authorizeSpy.mockResolvedValue({
      file_id: "image/abc",
      file_url: "https://s3/upload",
      status: "success",
    });

    const result = await user.createFileUploadRequest({
      fileName: "boot.bin",
      entityType: "ota_image",
      entityId: "ota-1",
      md5Checksum: "abc+def==",
      description: "Bootloader",
      fileType: "image",
      public: false,
    });

    expect(authorizeSpy).toHaveBeenCalledWith({
      url: APIEndpoints.USER_FILE_UPLOAD_REQUEST,
      method: HTTPMethods.GET,
      params: {
        file_name: "boot.bin",
        entity_type: "ota_image",
        entity_id: "ota-1",
        md5_checksum: "abc+def==",
      },
    });
    expect(result).toBeInstanceOf(ESPFileUploadRequest);
    expect(result).toMatchObject({
      fileId: "image/abc",
      uploadUrl: "https://s3/upload",
      confirmParams: {
        description: "Bootloader",
        fileType: "image",
        public: false,
      },
    });
  });
});
