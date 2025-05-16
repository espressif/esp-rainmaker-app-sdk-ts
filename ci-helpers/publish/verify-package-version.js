/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Script to verify that the version in package.json matches the pushed/created git tag version.
 * This script is used in the CI/CD pipeline at the publish-package job to ensure version consistency.
 */

import { readFile } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { formatMessage, ANSI_CODES } from "../utils.js";

// Get the directory path of this script
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Get root directory (two levels up from this script)
const rootDir = dirname(dirname(__dirname));

/**
 * Main function to verify package version against tag version
 */
async function verifyVersions() {
  // Get package version from root package.json
  const packageJsonPath = join(rootDir, "package.json");
  const packageJson = JSON.parse(await readFile(packageJsonPath, "utf8"));
  const packageVersion = packageJson.version;

  // Get tag version from CI environment
  const tagVersion = (process.env.CI_COMMIT_TAG || "").replace(/^v/, ""); // Remove 'v' prefix if present

  console.log(
    formatMessage(
      "Checking package version against tag version...",
      ANSI_CODES.BOLD_ITALIC
    )
  );

  // Compare versions
  if (!tagVersion) {
    throw new Error("CI_COMMIT_TAG environment variable is not set");
  }

  if (packageVersion !== tagVersion) {
    console.log(formatMessage("Version mismatch!", ANSI_CODES.BOLD_ITALIC));
    console.log(
      `${formatMessage("Package version:", ANSI_CODES.BOLD_ITALIC)} ${formatMessage(packageVersion, ANSI_CODES.BOLD_BLUE)}`
    );
    console.log(
      `${formatMessage("Tag version:", ANSI_CODES.BOLD_ITALIC)} ${formatMessage(tagVersion, ANSI_CODES.BOLD_BLUE)}`
    );
    console.log(
      formatMessage(
        "Please ensure package.json version matches the tag version",
        ANSI_CODES.BOLD_ITALIC
      )
    );
    throw new Error("Version mismatch detected");
  }

  console.log(
    formatMessage(
      "Version check passed! Proceeding with package publish...",
      ANSI_CODES.BOLD_ITALIC
    )
  );
}

// Handle any unhandled promise rejections
process.on("unhandledRejection", (error) => {
  console.error(
    formatMessage(
      `Unhandled promise rejection: ${error.message}`,
      ANSI_CODES.BOLD_ITALIC
    )
  );
  process.exit(1);
});

// Execute the check using try-catch
try {
  await verifyVersions();
  process.exit(0);
} catch (error) {
  console.error(
    formatMessage(
      `Error checking versions: ${error.message}`,
      ANSI_CODES.BOLD_ITALIC
    )
  );
  process.exit(1);
}
