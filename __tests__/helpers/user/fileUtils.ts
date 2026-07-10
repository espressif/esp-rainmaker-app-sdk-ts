/*
 * SPDX-FileCopyrightText: 2026 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ESPRMUser } from "../../../src/ESPRMUser";
import { ESPFile } from "../../../src/ESPFile";
import { configureAuthInstance } from "../../utils/configureAuthInstance";

const REQUIRED_ENV_VARS = [
  "API_BASE_URL",
  "API_VERSION",
  "USERNAME",
  "PASSWORD",
] as const;

export interface FileIntegrationContext {
  user: ESPRMUser;
  nodeId?: string;
}

/**
 * Returns true when all credentials required for live API tests are present.
 */
export function hasFileIntegrationCredentials(): boolean {
  return REQUIRED_ENV_VARS.every((key) => Boolean(process.env[key]?.trim()));
}

/**
 * Logs in with `.env.test` credentials and returns an authenticated user.
 */
export async function setupFileIntegrationEnvironment(): Promise<ESPRMUser> {
  const context = await setupFileIntegrationContext();
  return context.user;
}

/**
 * Logs in and resolves a node id when the account has provisioned nodes.
 */
export async function setupFileIntegrationContext(): Promise<FileIntegrationContext> {
  if (!hasFileIntegrationCredentials()) {
    throw new Error(
      "Missing integration test credentials. Copy .env.test.example to .env.test and set USERNAME/PASSWORD."
    );
  }

  const authInstance = configureAuthInstance();
  const user = await authInstance.login(
    process.env.USERNAME!,
    process.env.PASSWORD!
  );

  let nodeId: string | undefined;
  try {
    const nodes = await user.getUserNodesWith({
      nodeDetails: false,
      resultCount: 1,
    });
    nodeId = nodes.nodes[0]?.id;
  } catch {
    nodeId = undefined;
  }

  return { user, nodeId };
}

/**
 * Deletes leftover SDK integration test files from prior runs.
 */
export async function cleanupStaleIntegrationFiles(
  user: ESPRMUser
): Promise<void> {
  try {
    let result = await user.getFiles({ resultCount: 100 });

    const deleteMatchingFiles = async (files: ESPFile[]): Promise<void> => {
      for (const file of files) {
        if (!file.fileName?.startsWith("sdk-")) {
          continue;
        }

        try {
          await file.delete();
        } catch (error) {
          console.warn(`Cleanup: failed to delete stale file ${file.fileId}`, error);
        }
      }
    };

    await deleteMatchingFiles(result.files);

    while (result.hasNext && result.fetchNext) {
      result = await result.fetchNext();
      await deleteMatchingFiles(result.files);
    }
  } catch (error) {
    console.warn("Cleanup: failed to list stale integration files", error);
  }
}

/**
 * Logs out the authenticated user created for integration tests.
 */
export async function cleanupFileIntegrationEnvironment(
  user: ESPRMUser
): Promise<void> {
  try {
    await user.logout();
  } catch {
    console.warn("Cleanup: logout failed or no user was logged in");
  }
}

/**
 * Builds a unique integration test file name.
 */
export function createIntegrationFileName(prefix: string): string {
  return `sdk-${prefix}-${Date.now()}.bin`;
}

/**
 * Sample file bytes used across upload/download assertions.
 */
export function createIntegrationFileContent(): Uint8Array {
  return new Uint8Array([
    0x52, 0x4d, 0x5f, 0x46, 0x49, 0x4c, 0x45, 0x5f, 0x54, 0x45, 0x53, 0x54,
  ]);
}
