import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import { defineConfig } from "rollup";

// Plugins are created fresh per output so the two builds (ESM/CJS) don't share
// a single stateful TypeScript plugin instance. Type declarations are emitted
// separately by `npm run build:types` (tsconfig.types.json), so the TypeScript
// plugin here only transpiles to JS (declaration is disabled to avoid the
// plugin's requirement that declarationDir live inside each output dir).
const buildPlugins = () => [
  commonjs(),
  json(),
  typescript({
    tsconfig: "tsconfig.json",
    declaration: false,
    declarationMap: false,
  }),
  resolve({
    preferBuiltins: true, // Default behavior for Node.js
    extensions: [".js", ".ts"],
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
  plugins: buildPlugins(),
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
  plugins: buildPlugins(),
});

export default [esmConfig, cjsConfig];
