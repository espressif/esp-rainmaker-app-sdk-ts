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
};
