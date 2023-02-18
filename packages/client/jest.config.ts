import dotenv from "dotenv";
import type { JestConfigWithTsJest } from "ts-jest";
import { pathsToModuleNameMapper } from "ts-jest";
import { compilerOptions } from "./tsconfig.json";
import { sharedGlobals } from "./vite.config";
dotenv.config();

const config: JestConfigWithTsJest = {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "jsdom",
  testMatch: ["<rootDir>/src/**/*.test.{ts,tsx}"],
  globals: sharedGlobals,
  roots: ["<rootDir>"],
  modulePaths: [compilerOptions.baseUrl],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        useESM: true,
      },
    ],
  },
};
export default config;
