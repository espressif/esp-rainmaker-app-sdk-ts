/*
 * SPDX-FileCopyrightText: 2026 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { createHash } from "crypto";
import "../../../src/methods/ESPRMUser";
import { ESPFile } from "../../../src/ESPFile";
import { ESPFileUploadRequest } from "../../../src/ESPFileUploadRequest";
import { ESPRMUser } from "../../../src/ESPRMUser";
import {
  ESPFileUploadParams,
  ESPFileUploadProgressStatus,
} from "../../../src/types/input";
import {
  cleanupFileIntegrationEnvironment,
  cleanupStaleIntegrationFiles,
  createIntegrationFileContent,
  createIntegrationFileName,
  hasFileIntegrationCredentials,
  setupFileIntegrationContext,
} from "../../helpers/user/fileUtils";

/** Base64 MD5 of bytes — matches the Content-MD5 / md5_checksum format S3 expects. */
function createBase64Md5(content: Uint8Array): string {
  return createHash("md5").update(content).digest("base64");
}

const describeIntegration = hasFileIntegrationCredentials()
  ? describe
  : describe.skip;

describeIntegration("[Integration Test]: ESPRMUser file APIs", () => {
  let user: ESPRMUser;
  let nodeId: string | undefined;
  const uploadedFileIds: string[] = [];
  const testContent = createIntegrationFileContent();

  const buildUploadParams = (
    fileName: string,
    overrides: Partial<ESPFileUploadParams> = {}
  ): ESPFileUploadParams => ({
    fileName,
    entityType: "node",
    ...(nodeId !== undefined && { entityId: nodeId }),
    fileType: "image",
    ...overrides,
  });

  beforeAll(async () => {
    const context = await setupFileIntegrationContext();
    user = context.user;
    nodeId = context.nodeId;
    await cleanupStaleIntegrationFiles(user);
  }, 120_000);

  afterAll(async () => {
    for (const fileId of uploadedFileIds) {
      try {
        const file = await user.getFileById(fileId);
        if (file) {
          await file.delete();
        }
      } catch (error) {
        console.warn(`Cleanup: failed to delete file ${fileId}`, error);
      }
    }

    await cleanupFileIntegrationEnvironment(user);
  }, 120_000);

  const trackFile = (file: ESPFile): ESPFile => {
    uploadedFileIds.push(file.fileId);
    return file;
  };

  test("createFileUploadRequest returns a presigned upload request", async () => {
    const fileName = createIntegrationFileName("create-request");

    const uploadRequest = await user.createFileUploadRequest(
      buildUploadParams(fileName, {
        description: "SDK integration test - create request",
        public: false,
      })
    );

    expect(uploadRequest).toBeInstanceOf(ESPFileUploadRequest);
    expect(uploadRequest.fileId).toMatch(/^node\//);
    expect(uploadRequest.uploadUrl).toMatch(/^https?:\/\//);
    expect(uploadRequest.fileName).toBe(fileName);
    expect(uploadRequest.entityType).toBe("node");
    expect(uploadRequest.confirmParams).toMatchObject({
      description: "SDK integration test - create request",
      fileType: "image",
      public: false,
    });
  }, 60_000);

  test("upload request flow uploads to S3 and confirms", async () => {
    const fileName = createIntegrationFileName("split-upload");
    const uploadRequest = await user.createFileUploadRequest(
      buildUploadParams(fileName, {
        description: "SDK integration test - split upload",
      })
    );

    const progress: ESPFileUploadProgressStatus[] = [];
    const file = trackFile(
      await uploadRequest.upload(testContent, undefined, (event) => {
        progress.push(event.status);
      })
    );

    expect(progress).toEqual([
      ESPFileUploadProgressStatus.uploading,
      ESPFileUploadProgressStatus.confirming,
    ]);
    expect(file).toBeInstanceOf(ESPFile);
    expect(file.fileId).toBe(uploadRequest.fileId);
    expect(file.downloadUrl).toMatch(/^https?:\/\//);
    expect(file.description).toBe("SDK integration test - split upload");
    expect(file.fileType).toBe("image");
  }, 120_000);

  test("uploadFile performs create, S3 upload, and confirm in one call", async () => {
    const fileName = createIntegrationFileName("one-shot");
    const progress: ESPFileUploadProgressStatus[] = [];

    const file = trackFile(
      await user.uploadFile(
        testContent,
        buildUploadParams(fileName, {
          description: "SDK integration test - one-shot upload",
          metadata: { source: "sdk-integration-test" },
        }),
        (event) => progress.push(event.status)
      )
    );

    expect(progress).toEqual([
      ESPFileUploadProgressStatus.creatingRequest,
      ESPFileUploadProgressStatus.uploading,
      ESPFileUploadProgressStatus.confirming,
    ]);
    expect(file.fileId).toMatch(/^node\//);
    expect(file.downloadUrl).toMatch(/^https?:\/\//);
    expect(file.description).toBe("SDK integration test - one-shot upload");
    expect(file.fileType).toBe("image");
  }, 120_000);

  test("getFileById returns the uploaded file record", async () => {
    const fileName = createIntegrationFileName("get-by-id");
    const uploaded = trackFile(
      await user.uploadFile(
        testContent,
        buildUploadParams(fileName, {
          description: "SDK integration test - get by id",
        })
      )
    );

    const file = await user.getFileById(uploaded.fileId);

    expect(file).toBeInstanceOf(ESPFile);
    expect(file).toMatchObject({
      fileId: uploaded.fileId,
      description: "SDK integration test - get by id",
      fileType: "image",
      entityType: "node",
      ...(nodeId !== undefined && { entityId: nodeId }),
    });
    expect(file?.fileName?.startsWith(fileName.replace(/\.bin$/, ""))).toBe(
      true
    );
    expect(file?.downloadUrl).toMatch(/^https?:\/\//);
  }, 120_000);

  test("getFiles lists uploaded files with filters", async () => {
    if (nodeId === undefined) {
      console.warn("Skipping list filter assertion: account has no nodes");
      return;
    }

    const fileName = createIntegrationFileName("list-files");
    const uploaded = trackFile(
      await user.uploadFile(
        testContent,
        buildUploadParams(fileName, {
          description: "SDK integration test - list files",
        })
      )
    );

    const result = await user.getFiles({
      entityType: "node",
      entityId: nodeId,
      resultCount: 25,
    });

    const match =
      result.files.find((file) => file.fileId === uploaded.fileId) ??
      (
        await user.getFiles({
          fileName: fileName.replace(/\.bin$/, ""),
          resultCount: 25,
        })
      ).files.find((file) => file.fileId === uploaded.fileId);

    expect(result.files.every((file) => file instanceof ESPFile)).toBe(true);
    expect(match).toBeDefined();
    expect(match?.fileName?.startsWith(fileName.replace(/\.bin$/, ""))).toBe(
      true
    );
  }, 120_000);

  test("downloadFile returns the original file bytes", async () => {
    const fileName = createIntegrationFileName("download");
    const uploaded = trackFile(
      await user.uploadFile(
        testContent,
        buildUploadParams(fileName, {
          description: "SDK integration test - download",
        })
      )
    );

    const downloaded = await user.downloadFile(uploaded.fileId, {
      format: "uint8Array",
    });

    expect(downloaded).toBeInstanceOf(Uint8Array);
    expect(Array.from(downloaded as Uint8Array)).toEqual(
      Array.from(testContent)
    );
  }, 120_000);

  test("ESPFile refresh and download work on the domain object", async () => {
    const fileName = createIntegrationFileName("domain");
    const uploaded = trackFile(
      await user.uploadFile(
        testContent,
        buildUploadParams(fileName, {
          description: "SDK integration test - domain methods",
        })
      )
    );

    const refreshed = await uploaded.refresh();
    expect(refreshed).toBe(uploaded);
    expect(refreshed?.fileName?.startsWith(fileName.replace(/\.bin$/, ""))).toBe(
      true
    );
    expect(uploaded.getDownloadUrl()).toMatch(/^https?:\/\//);

    const downloaded = await uploaded.download({ format: "uint8Array" });
    expect(Array.from(downloaded as Uint8Array)).toEqual(
      Array.from(testContent)
    );
  }, 120_000);

  test("ESPFile update and delete work against the backend", async () => {
    const fileName = createIntegrationFileName("update-delete");
    const file = trackFile(
      await user.uploadFile(
        testContent,
        buildUploadParams(fileName, {
          description: "SDK integration test - update delete",
          public: false,
        })
      )
    );

    await file.updatePublic(true);
    expect(file.public).toBe(true);

    await file.delete();

    const removedIndex = uploadedFileIds.indexOf(file.fileId);
    if (removedIndex >= 0) {
      uploadedFileIds.splice(removedIndex, 1);
    }

    const missing = await user.getFileById(file.fileId);
    expect(missing).toBeNull();
  }, 120_000);

  test("file lifecycle: upload → get → list → download → update → delete", async () => {
    const fileName = createIntegrationFileName("lifecycle");
    const progress: ESPFileUploadProgressStatus[] = [];
    const md5Checksum = createBase64Md5(testContent);

    console.log("[lifecycle] md5Checksum", {
      md5Checksum,
      byteLength: testContent.byteLength,
    });

    // 1. Upload with MD5 (same file for the rest of this test)
    const uploaded = trackFile(
      await user.uploadFile(
        testContent,
        buildUploadParams(fileName, {
          description: "SDK integration test - lifecycle",
          public: false,
          md5Checksum,
        }),
        (event) => progress.push(event.status)
      )
    );

    expect(progress).toEqual([
      ESPFileUploadProgressStatus.creatingRequest,
      ESPFileUploadProgressStatus.uploading,
      ESPFileUploadProgressStatus.confirming,
    ]);
    expect(uploaded.fileId).toMatch(/^node\//);
    expect(uploaded.downloadUrl).toMatch(/^https?:\/\//);

    const fileId = uploaded.fileId;
    console.log("[lifecycle] uploaded", {
      fileId,
      fileName: uploaded.fileName,
      entityType: uploaded.entityType,
      entityId: uploaded.entityId,
      nodeId,
      md5Checksum,
    });

    // 2. Get by id
    const byId = await user.getFileById(fileId);
    console.log("[lifecycle] getFileById", {
      found: Boolean(byId),
      fileId: byId?.fileId,
      fileName: byId?.fileName,
      entityId: byId?.entityId,
    });
    expect(byId).toBeInstanceOf(ESPFile);
    expect(byId?.fileId).toBe(fileId);

    // 3. List — try entity filters, then fileName fallback
    const listedByEntity =
      nodeId !== undefined
        ? await user.getFiles({
            entityType: "node",
            entityId: nodeId,
            resultCount: 25,
          })
        : undefined;

    console.log("[lifecycle] getFiles by entity", {
      nodeId,
      count: listedByEntity?.files.length,
      fileIds: listedByEntity?.files.map((f) => f.fileId),
      hasNext: listedByEntity?.hasNext,
    });

    const fileNamePrefix = fileName.replace(/\.bin$/, "");
    const listedByName = await user.getFiles({
      fileName: fileNamePrefix,
      resultCount: 25,
    });

    console.log("[lifecycle] getFiles by fileName", {
      fileNamePrefix,
      count: listedByName.files.length,
      files: listedByName.files.map((f) => ({
        fileId: f.fileId,
        fileName: f.fileName,
        entityId: f.entityId,
      })),
      hasNext: listedByName.hasNext,
    });

    const match =
      listedByEntity?.files.find((f) => f.fileId === fileId) ??
      listedByName.files.find((f) => f.fileId === fileId);

    console.log("[lifecycle] list match", {
      matched: Boolean(match),
      via: match
        ? listedByEntity?.files.some((f) => f.fileId === fileId)
          ? "entity"
          : "fileName"
        : "none",
    });

    expect(match).toBeDefined();
    expect(match?.fileId).toBe(fileId);

    // 4. Download bytes + verify MD5 still matches
    const downloaded = await user.downloadFile(fileId, { format: "uint8Array" });
    const downloadedMd5 = createBase64Md5(downloaded as Uint8Array);
    console.log("[lifecycle] downloadFile", {
      fileId,
      byteLength: (downloaded as Uint8Array).byteLength,
      matchesOriginal: Array.from(downloaded as Uint8Array).every(
        (b, i) => b === testContent[i]
      ),
      uploadedMd5: md5Checksum,
      downloadedMd5,
      md5Match: downloadedMd5 === md5Checksum,
    });
    expect(Array.from(downloaded as Uint8Array)).toEqual(
      Array.from(testContent)
    );
    expect(downloadedMd5).toBe(md5Checksum);

    // 5. Domain refresh + download
    const refreshed = await uploaded.refresh();
    console.log("[lifecycle] refresh", {
      fileId: refreshed?.fileId,
      fileName: refreshed?.fileName,
      downloadUrl: refreshed?.downloadUrl,
      public: refreshed?.public,
    });
    expect(refreshed?.fileId).toBe(fileId);
    const viaDomain = await uploaded.download({ format: "uint8Array" });
    console.log("[lifecycle] ESPFile.download", {
      fileId,
      byteLength: (viaDomain as Uint8Array).byteLength,
      matchesOriginal: Array.from(viaDomain as Uint8Array).every(
        (b, i) => b === testContent[i]
      ),
    });
    expect(Array.from(viaDomain as Uint8Array)).toEqual(
      Array.from(testContent)
    );

    // 6. Update
    await uploaded.updatePublic(true);
    console.log("[lifecycle] updatePublic", { fileId, public: uploaded.public });
    expect(uploaded.public).toBe(true);

    // 7. Delete + verify gone
    await uploaded.delete();
    console.log("[lifecycle] delete", { fileId, deleted: true });

    const removedIndex = uploadedFileIds.indexOf(fileId);
    if (removedIndex >= 0) {
      uploadedFileIds.splice(removedIndex, 1);
    }

    const missing = await user.getFileById(fileId);
    console.log("[lifecycle] verify deleted", {
      fileId,
      getFileById: missing,
    });
    expect(missing).toBeNull();

    console.log("[lifecycle] complete cycle ok", {
      fileId,
      md5Checksum,
      steps: [
        "md5Checksum",
        "upload",
        "getFileById",
        "getFiles",
        "downloadFile",
        "md5Verify",
        "refresh",
        "ESPFile.download",
        "updatePublic",
        "delete",
      ],
    });
  }, 180_000);
});
