/** @type {import('ts-jest').JestConfigWithTsJest} **/

export default {
  preset: "ts-jest",
  testEnvironment: "node",
  displayName: "@espressif/rainmaker-base-sdk",
  testMatch: ["<rootDir>/__tests__/**/*.(spec|test).[jt]s?(x)"],
  setupFiles: ["<rootDir>/jest.setup.ts"],
  reporters: [
    "default",
    [
      "jest-junit",
      {
        outputDirectory: "./",
        outputName: "junit.xml",
        suiteName: "jest tests",
        classNameTemplate: "{classname}",
        titleTemplate: "{title}",
        ancestorSeparator: " > ",
        usePathForSuiteName: true,
      },
    ],
  ],
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: [
    "text",
    "lcov",
    ["cobertura", { file: "cobertura-coverage.xml" }],
  ],
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/*.test.{js,jsx,ts,tsx}",
    "!src/**/index.{js,jsx,ts,tsx}",
    "!src/proto/**/*",
  ],
};
