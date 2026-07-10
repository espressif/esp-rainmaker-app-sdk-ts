/*
 * SPDX-FileCopyrightText: 2026 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  buildConfirmRequestBody,
  buildFileListParams,
  buildUploadRequestParams,
  createFilePaginatedResult,
  normalizeDownloadResult,
  splitUploadParams,
  transformFile,
  transformFileUploadRequest,
  validateUploadContentSize,
} from "../../src/services/ESPRMHelpers/ESPFileHelpers";
import {
  APICallValidationErrorCodes,
  FileConstants,
} from "../../src/utils/constants";
import { ESPAPICallValidationError } from "../../src/utils/error/Error";

describe("[Unit Test]: ESPFileHelpers", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("splitUploadParams()", () => {
    test("splits merged upload params into request and confirm parts", () => {
      const result = splitUploadParams({
        fileName: "boot.bin",
        entityType: "ota_image",
        entityId: "ota-1",
        md5Checksum: "abc+def==",
        description: "Bootloader",
        fileType: "image",
        public: false,
      });

      expect(result.requestParams).toEqual({
        fileName: "boot.bin",
        entityType: "ota_image",
        entityId: "ota-1",
        md5Checksum: "abc+def==",
      });
      expect(result.confirmParams).toEqual({
        description: "Bootloader",
        fileType: "image",
        public: false,
      });
    });
  });

  describe("transformFile()", () => {
    test("maps API record fields to the SDK shape", () => {
      const result = transformFile({
        file_id: "image/abc",
        file_name: "profile.png",
        description: "Profile",
        entity_type: "node",
        entity_id: "node-1",
        file_type: "image",
        timestamp: "123",
        s3_key: "s3/key",
        user_id: "user-1",
        file_url: "https://s3/download",
        public: true,
      });

      expect(result).toEqual({
        fileId: "image/abc",
        fileName: "profile.png",
        description: "Profile",
        metadata: undefined,
        entityType: "node",
        entityId: "node-1",
        fileType: "image",
        timestamp: "123",
        s3Key: "s3/key",
        userId: "user-1",
        userName: undefined,
        downloadUrl: "https://s3/download",
        public: true,
      });
    });

    test("maps file list records with user_name and file_md5", () => {
      const result = transformFile({
        user_id: "abc123-user-id",
        user_name: "john@example.com",
        file_id: "file123",
        file_name: "config_template.json",
        file_type: "config",
        public: true,
        file_md5: "d41d8cd98f00b204e9800998ecf8427e",
      });

      expect(result).toEqual({
        fileId: "file123",
        fileName: "config_template.json",
        description: undefined,
        metadata: undefined,
        entityType: undefined,
        entityId: undefined,
        fileType: "config",
        timestamp: undefined,
        s3Key: undefined,
        fileMd5: "d41d8cd98f00b204e9800998ecf8427e",
        userId: "abc123-user-id",
        userName: "john@example.com",
        downloadUrl: undefined,
        public: true,
      });
    });
  });

  describe("transformFileUploadRequest()", () => {
    test("maps upload request response to upload-request fields", () => {
      const result = transformFileUploadRequest(
        {
          file_id: "image/new",
          upload_url: "https://s3/upload",
          status: "success",
        },
        {
          fileName: "new.bin",
          entityType: "node",
        },
        { fileType: "log" }
      );

      expect(result).toEqual({
        fileId: "image/new",
        uploadUrl: "https://s3/upload",
        fileName: "new.bin",
        entityType: "node",
        entityId: undefined,
        md5Checksum: undefined,
        confirmParams: { fileType: "log" },
      });
    });

    test("falls back to file_url when upload_url is absent", () => {
      const result = transformFileUploadRequest(
        {
          file_id: "node/new",
          file_url: "https://s3/legacy-upload",
          status: "success",
        },
        {
          fileName: "legacy.bin",
          entityType: "node",
        }
      );

      expect(result.uploadUrl).toBe("https://s3/legacy-upload");
    });
  });

  describe("buildUploadRequestParams()", () => {
    test("maps SDK fields to API query params", () => {
      expect(
        buildUploadRequestParams({
          fileName: "boot.bin",
          entityType: "ota_image",
          entityId: "ota-1",
          md5Checksum: "abc+def==",
        })
      ).toEqual({
        file_name: "boot.bin",
        entity_type: "ota_image",
        entity_id: "ota-1",
        md5_checksum: "abc+def==",
      });
    });

    test("throws when fileName is missing", () => {
      expect(() =>
        buildUploadRequestParams({
          fileName: "",
          entityType: "node",
        })
      ).toThrow(ESPAPICallValidationError);

      try {
        buildUploadRequestParams({ fileName: "", entityType: "node" });
      } catch (error) {
        expect((error as ESPAPICallValidationError).code).toBe(
          APICallValidationErrorCodes.MISSING_FILE_NAME
        );
      }
    });

    test("throws when entityId is missing for ota_image", () => {
      try {
        buildUploadRequestParams({
          fileName: "boot.bin",
          entityType: FileConstants.OTA_IMAGE_ENTITY_TYPE,
        });
      } catch (error) {
        expect((error as ESPAPICallValidationError).code).toBe(
          APICallValidationErrorCodes.MISSING_FILE_ENTITY_ID
        );
      }
    });
  });

  describe("buildConfirmRequestBody()", () => {
    test("maps confirm params to API body", () => {
      expect(
        buildConfirmRequestBody("image/abc", {
          description: "Profile",
          fileType: "image",
          public: true,
          metadata: { key: "value" },
        })
      ).toEqual({
        file_id: "image/abc",
        description: "Profile",
        file_type: "image",
        public: true,
        metadata: { key: "value" },
      });
    });
  });

  describe("buildFileListParams()", () => {
    test("forces num_records to 1 when fileId is provided", () => {
      expect(
        buildFileListParams({
          fileId: "image/abc",
          userName: "otheruser",
        })
      ).toEqual({
        file_id: "image/abc",
        user_name: "otheruser",
        num_records: 1,
      });
    });

    test("maps list filters and pagination", () => {
      expect(
        buildFileListParams(
          {
            entityType: "node",
            entityId: "node-1",
            resultCount: 10,
          },
          "cursor-1"
        )
      ).toEqual({
        entity_type: "node",
        entity_id: "node-1",
        num_records: 10,
        start_id: "cursor-1",
      });
    });
  });

  describe("createFilePaginatedResult()", () => {
    test("includes fetchNext when next id is present", async () => {
      const fetchNextPage = jest.fn().mockResolvedValue({
        files: [],
        hasNext: false,
      });
      const file = { fileId: "image/1" };

      const result = createFilePaginatedResult(
        [file],
        "next-1",
        fetchNextPage
      );

      expect(result.hasNext).toBe(true);
      expect(result.fetchNext).toBeDefined();
      await result.fetchNext?.();
      expect(fetchNextPage).toHaveBeenCalledWith("next-1");
    });
  });

  describe("normalizeDownloadResult()", () => {
    test("returns uint8Array when format is uint8Array", () => {
      const buffer = new ArrayBuffer(2);
      const result = normalizeDownloadResult(buffer, "uint8Array");
      expect(result).toBeInstanceOf(Uint8Array);
    });

    test("returns blob when format is blob", () => {
      const buffer = new ArrayBuffer(2);
      const result = normalizeDownloadResult(buffer, "blob");
      expect(result).toBeInstanceOf(Blob);
    });
  });

  describe("validateUploadContentSize()", () => {
    test("throws when content exceeds 10 MB", () => {
      const large = new Uint8Array(FileConstants.MAX_FILE_SIZE_BYTES + 1);

      try {
        validateUploadContentSize(large);
      } catch (error) {
        expect((error as ESPAPICallValidationError).code).toBe(
          APICallValidationErrorCodes.FILE_TOO_LARGE
        );
      }
    });
  });
});
