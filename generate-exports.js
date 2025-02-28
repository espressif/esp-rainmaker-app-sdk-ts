/*
 * SPDX-FileCopyrightText: 2025 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

// Convert ES Module path to CommonJS-compatible paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distTypesDir = path.join(__dirname, "dist/types");
const packageJsonPath = path.join(__dirname, "package.json");

async function updatePackageJson() {
  try {
    // Read package.json
    const packageJsonRaw = await fs.readFile(packageJsonPath, "utf-8");
    const packageJson = JSON.parse(packageJsonRaw);

    // Read all .d.ts files, skipping index.d.ts
    const files = (await fs.readdir(distTypesDir))
      .filter((file) => file.endsWith(".d.ts") && file !== "index.d.ts")
      .map((file) => path.basename(file, ".d.ts"));

    const exportsConfig = files.reduce((acc, file) => {
      acc[`./${file}`] = {
        import: `./dist/esm/${file}.js`,
        require: `./dist/cjs/${file}.cjs`,
        types: `./dist/types/${file}.d.ts`,
      };
      return acc;
    }, {});

    // Ensure index is mapped correctly
    exportsConfig["."] = {
      import: "./dist/esm/index.js",
      require: "./dist/cjs/index.cjs",
      types: "./dist/types/index.d.ts",
    };

    // Merge with existing exports
    packageJson.exports = {
      ...packageJson.exports,
      ...exportsConfig,
    };

    // Ensure the JSON output has a newline at the end
    const formattedJson = JSON.stringify(packageJson, null, 2);
    const finalJson = formattedJson.endsWith("\n")
      ? formattedJson
      : formattedJson + "\n";

    // Write back to package.json
    await fs.writeFile(packageJsonPath, finalJson);
    console.log("Exports field updated in package.json");
  } catch (error) {
    console.error("Error updating package.json:", error);
  }
}

updatePackageJson();
