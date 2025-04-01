import typescript from "rollup-plugin-typescript2";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import { defineConfig } from "rollup";

// Common Rollup plugins
const commonPlugins = [
  commonjs(),
  json(),
  typescript({
    tsconfig: "tsconfig.json",
    useTsconfigDeclarationDir: true,
    clean: true,
  }),
];

// ESM Configuration
const esmConfig = defineConfig({
  input: "src/index.ts",
  output: {
    dir: "dist/esm",
    format: "es",
    sourcemap: true,
    preserveModules: true,
    preserveModulesRoot: "src",
    entryFileNames: "[name].js", // Define how the files will be named
  },
  external: ["google-protobuf"], // Exclude external dependencies from the bundle
  plugins: [
    ...commonPlugins,
    resolve({
      preferBuiltins: true, // Default behavior for Node.js
      extensions: [".js", ".ts"],
    }),
  ],
});

// CommonJS Configuration
const cjsConfig = defineConfig({
  input: "src/index.ts",
  output: {
    dir: "dist/cjs",
    format: "cjs",
    sourcemap: true,
    preserveModules: true,
    preserveModulesRoot: "src",
    entryFileNames: "[name].cjs", // Define how the files will be named
    exports: "named", // Disable default export warning
  },
  external: ["google-protobuf"], // Exclude external dependencies from the bundle
  plugins: [
    ...commonPlugins,
    resolve({
      preferBuiltins: true, // Default behavior for Node.js
      extensions: [".js", ".ts"],
    }),
  ],
});

export default [esmConfig, cjsConfig];
