/*
 * SPDX-FileCopyrightText: 2026 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import "../../src/methods/ESPRMUser";
import { ESPFile } from "../../src/ESPFile";
import { ESPRMUser } from "../../src/ESPRMUser";
import { ESPRMAPIManager } from "../../src/services/ESPRMAPIManager";
import {
  APIEndpoints,
  ErrorLabels,
  FileErrorCodes,
  HTTPMethods,
} from "../../src/utils/constants";
import { ESPFileError } from "../../src/utils/error/ESPFileError";
import { ESPFileUploadProgressStatus } from "../../src/types/input";
import { MOCK_USER_TOKENS } from "../helpers/provision/utils";

jest.mock("../../src/services/ESPRMStorage/ESPRMStorage");

describe("[Unit Test]: ESPRMUser - uploadFile()", () => {
  let user: ESPRMUser;

  beforeEach(() => {
    user = new ESPRMUser(MOCK_USER_TOKENS);
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      text: jest.fn().mockResolvedValue(""),
    }) as jest.Mock;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("uploadFile creates request, uploads to S3, and confirms", async () => {
    const authorizeSpy = jest.spyOn(ESPRMAPIManager, "authorizeRequest");
    authorizeSpy
      .mockResolvedValueOnce({
        file_id: "image/abc",
        file_url: "https://s3/upload",
        status: "success",
      })
      .mockResolvedValueOnce({
        file_id: "image/abc",
        file_url: "https://s3/download",
        status: "success",
      })
      .mockResolvedValueOnce({
        file_details: [
          {
            file_id: "image/abc",
            file_url: "https://s3/download",
            description: "Bootloader",
            file_type: "image",
          },
        ],
      });

    const progress: string[] = [];
    const content = new Uint8Array([1, 2, 3]);

    const result = await user.uploadFile(
      content,
      {
        fileName: "boot.bin",
        entityType: "node",
        fileType: "image",
        description: "Bootloader",
      },
      (event) => progress.push(event.status)
    );

    expect(progress).toEqual([
      ESPFileUploadProgressStatus.creatingRequest,
      ESPFileUploadProgressStatus.uploading,
      ESPFileUploadProgressStatus.confirming,
    ]);
    expect(global.fetch).toHaveBeenCalledWith(
      "https://s3/upload",
      expect.objectContaining({
        method: HTTPMethods.PUT,
        headers: { "Content-Type": "application/octet-stream" },
        body: expect.any(Blob),
      })
    );
    expect(authorizeSpy).toHaveBeenNthCalledWith(2, {
      url: APIEndpoints.USER_FILE_UPLOAD_CONFIRM,
      method: HTTPMethods.POST,
      data: {
        file_id: "image/abc",
        description: "Bootloader",
        file_type: "image",
      },
    });
    expect(authorizeSpy).toHaveBeenNthCalledWith(3, {
      url: APIEndpoints.USER_FILE,
      method: HTTPMethods.GET,
      params: { file_id: "image/abc", num_records: 1 },
    });
    expect(result).toBeInstanceOf(ESPFile);
    expect(result).toMatchObject({
      fileId: "image/abc",
      downloadUrl: "https://s3/download",
      description: "Bootloader",
      fileType: "image",
    });
  });

  test("uploadFile throws ESPFileError with upload label when S3 PUT fails", async () => {
    jest.spyOn(ESPRMAPIManager, "authorizeRequest").mockResolvedValue({
      file_id: "image/abc",
      file_url: "https://s3/upload",
      status: "success",
    });
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 403,
      text: jest
        .fn()
        .mockResolvedValue(
          "<Error><Code>SignatureDoesNotMatch</Code><Message>mismatch</Message></Error>"
        ),
    }) as jest.Mock;

    try {
      await user.uploadFile(new Uint8Array([1, 2, 3]), {
        fileName: "boot.bin",
        entityType: "node",
      });
      fail("Expected uploadFile to throw");
    } catch (error) {
      expect(error).toBeInstanceOf(ESPFileError);
      expect((error as ESPFileError).code).toBe(FileErrorCodes.S3_UPLOAD_FAILED);
      expect((error as ESPFileError).status).toBe(403);
      expect((error as ESPFileError).body).toContain("SignatureDoesNotMatch");
      expect((error as ESPFileError).message).toContain("403");
      expect((error as ESPFileError).message).toContain("SignatureDoesNotMatch");
      expect((error as ESPFileError).label).toBe(ErrorLabels.ESPFileUploadError);
    }
  });
});
