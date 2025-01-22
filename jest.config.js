/** @type {import('ts-jest').JestConfigWithTsJest} **/

export default {
  projects: [
    {
      preset: "ts-jest",
      testEnvironment: "node",
      displayName: "@espressif/rainmaker-base-sdk",
      testMatch: ["<rootDir>/__tests__/**/*.(spec|test).[jt]s?(x)"],
      setupFiles: ["<rootDir>/jest.setup.ts"],
    },
  ],
};
