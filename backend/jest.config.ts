import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src/tests"],
  moduleFileExtensions: ["ts", "js"],
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  setupFiles: ["dotenv/config"],
};

export default config;