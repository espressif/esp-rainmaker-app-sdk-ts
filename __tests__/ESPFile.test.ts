/*
 * SPDX-FileCopyrightText: 2026 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPFile } from "../src/ESPFile";
import { ESPFileUploadRequest } from "../src/ESPFileUploadRequest";
import * as ESPFileHelpers from "../src/services/ESPRMHelpers/ESPFileHelpers";
import { ESPRMAPIManager } from "../src/services/ESPRMAPIManager";
import { APIEndpoints, ErrorLabels, FileErrorCodes, HTTPMethods } from "../src/utils/constants";
import { ESPFileError } from "../src/utils/error/ESPFileError";

describe("[Unit Test]: ESPFile domain classes", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("ESPFileUploadRequest", () => {
    test("upload uploads to S3 and auto-confirms with stored params", async () => {
      jest.spyOn(ESPFileHelpers, "uploadToPresignedUrl").mockResolvedValue();
      jest.spyOn(ESPFileHelpers, "confirmFileUpload").mockResolvedValue({
        fileId: "image/abc",
        downloadUrl: "https://s3/download",
        fileType: "image",
      });

      const uploadReq = new ESPFileUploadRequest({
        fileId: "image/abc",
        uploadUrl: "https://s3/upload",
        fileName: "boot.bin",
        entityType: "node",
        confirmParams: { fileType: "image", public: false },
      });

      const content = new Uint8Array([1, 2, 3]);
      const result = await uploadReq.upload(content);

      expect(ESPFileHelpers.uploadToPresignedUrl).toHaveBeenCalledWith(
        "https://s3/upload",
        content,
        undefined
      );
      expect(ESPFileHelpers.confirmFileUpload).toHaveBeenCalledWith(
        "image/abc",
        { fileType: "image", public: false }
      );
      expect(result).toBeInstanceOf(ESPFile);
    });

    test("confirm merges stored and override params", async () => {
      jest.spyOn(ESPFileHelpers, "confirmFileUpload").mockResolvedValue({
        fileId: "image/abc",
      });

      const uploadReq = new ESPFileUploadRequest({
        fileId: "image/abc",
        uploadUrl: "https://s3/upload",
        fileName: "boot.bin",
        entityType: "node",
        confirmParams: { fileType: "image", public: false },
      });

      await uploadReq.confirm({ public: true });

      expect(ESPFileHelpers.confirmFileUpload).toHaveBeenCalledWith(
        "image/abc",
        { fileType: "image", public: true }
      );
    });
  });

  describe("ESPFile", () => {
    test("refresh updates instance in place", async () => {
      jest.spyOn(ESPFileHelpers, "fetchFileList").mockResolvedValue({
        files: [
          {
            fileId: "image/abc",
            fileName: "updated.png",
            downloadUrl: "https://s3/new",
          },
        ],
        hasNext: false,
      });

      const file = new ESPFile({ fileId: "image/abc" });
      const result = await file.refresh();

      expect(result).toBe(file);
      expect(file.fileName).toBe("updated.png");
      expect(file.downloadUrl).toBe("https://s3/new");
    });

    test("updatePublic PUTs public status and refreshes from backend", async () => {
      const authorizeSpy = jest.spyOn(ESPRMAPIManager, "authorizeRequest");
      authorizeSpy.mockResolvedValue({ status: "success" });
      jest.spyOn(ESPFileHelpers, "fetchFileList").mockResolvedValue({
        files: [
          {
            fileId: "image/abc",
            public: true,
          },
        ],
        hasNext: false,
      });

      const file = new ESPFile({ fileId: "image/abc", public: false });
      await file.updatePublic(true);

      expect(authorizeSpy).toHaveBeenCalledWith({
        url: APIEndpoints.USER_FILE,
        method: HTTPMethods.PUT,
        params: { file_id: "image/abc" },
        data: { public: true },
      });
      expect(file.public).toBe(true);
    });

    test("delete DELETEs file by id", async () => {
      const authorizeSpy = jest.spyOn(ESPRMAPIManager, "authorizeRequest");
      authorizeSpy.mockResolvedValue({ status: "success" });

      const file = new ESPFile({ fileId: "image/abc" });
      await file.delete();

      expect(authorizeSpy).toHaveBeenCalledWith({
        url: APIEndpoints.USER_FILE,
        method: HTTPMethods.DELETE,
        params: { file_id: "image/abc" },
      });
    });

    test("download throws ESPFileError when no download URL is available", async () => {
      jest.spyOn(ESPFileHelpers, "fetchFileList").mockResolvedValue({
        files: [{ fileId: "image/abc" }],
        hasNext: false,
      });

      const file = new ESPFile({ fileId: "image/abc" });

      try {
        await file.download();
        fail("Expected download to throw");
      } catch (error) {
        expect(error).toBeInstanceOf(ESPFileError);
        expect((error as ESPFileError).code).toBe(
          FileErrorCodes.NO_DOWNLOAD_URL
        );
        expect((error as ESPFileError).label).toBe(
          ErrorLabels.ESPFileDownloadError
        );
      }
    });
  });
});
