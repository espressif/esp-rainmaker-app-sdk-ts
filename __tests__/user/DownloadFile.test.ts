/*
 * SPDX-FileCopyrightText: 2026 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import "../../src/methods/ESPRMUser";
import { ESPRMUser } from "../../src/ESPRMUser";
import { ESPRMAPIManager } from "../../src/services/ESPRMAPIManager";
import {
  APIEndpoints,
  ErrorLabels,
  FileErrorCodes,
  HTTPMethods,
} from "../../src/utils/constants";
import { ESPFileError } from "../../src/utils/error/ESPFileError";
import { MOCK_USER_TOKENS } from "../helpers/provision/utils";

jest.mock("../../src/services/ESPRMStorage/ESPRMStorage");

describe("[Unit Test]: ESPRMUser - downloadFile()", () => {
  let user: ESPRMUser;

  beforeEach(() => {
    user = new ESPRMUser(MOCK_USER_TOKENS);
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      arrayBuffer: jest.fn().mockResolvedValue(new Uint8Array([1, 2, 3]).buffer),
    }) as jest.Mock;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("downloadFile fetches metadata then downloads from S3", async () => {
    const authorizeSpy = jest.spyOn(ESPRMAPIManager, "authorizeRequest");
    authorizeSpy.mockResolvedValue({
      file_details: [
        {
          file_id: "image/abc",
          file_url: "https://s3/download",
        },
      ],
    });

    const result = await user.downloadFile("image/abc", { format: "uint8Array" });

    expect(authorizeSpy).toHaveBeenCalledWith({
      url: APIEndpoints.USER_FILE,
      method: HTTPMethods.GET,
      params: {
        file_id: "image/abc",
        num_records: 1,
      },
    });
    expect(global.fetch).toHaveBeenCalledWith("https://s3/download", {
      method: HTTPMethods.GET,
      signal: undefined,
    });
    expect(result).toBeInstanceOf(Uint8Array);
    expect(Array.from(result as Uint8Array)).toEqual([1, 2, 3]);
  });

  test("downloadFile throws ESPFileError with not-found label when file is missing", async () => {
    jest
      .spyOn(ESPRMAPIManager, "authorizeRequest")
      .mockResolvedValue({ file_details: [] });

    try {
      await user.downloadFile("missing");
      fail("Expected downloadFile to throw");
    } catch (error) {
      expect(error).toBeInstanceOf(ESPFileError);
      expect((error as ESPFileError).code).toBe(FileErrorCodes.FILE_NOT_FOUND);
      expect((error as ESPFileError).fileId).toBe("missing");
      expect((error as ESPFileError).label).toBe(
        ErrorLabels.ESPFileNotFoundError
      );
    }
  });

  test("downloadFile throws ESPFileError with download label when S3 GET fails", async () => {
    jest.spyOn(ESPRMAPIManager, "authorizeRequest").mockResolvedValue({
      file_details: [
        {
          file_id: "image/abc",
          file_url: "https://s3/download",
        },
      ],
    });
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 403,
      text: jest.fn().mockResolvedValue("expired"),
    }) as jest.Mock;

    try {
      await user.downloadFile("image/abc");
      fail("Expected downloadFile to throw");
    } catch (error) {
      expect(error).toBeInstanceOf(ESPFileError);
      expect((error as ESPFileError).code).toBe(
        FileErrorCodes.S3_DOWNLOAD_FAILED
      );
      expect((error as ESPFileError).status).toBe(403);
      expect((error as ESPFileError).body).toBe("expired");
      expect((error as ESPFileError).message).toContain("403");
      expect((error as ESPFileError).message).toContain("expired");
      expect((error as ESPFileError).label).toBe(
        ErrorLabels.ESPFileDownloadError
      );
    }
  });
});
