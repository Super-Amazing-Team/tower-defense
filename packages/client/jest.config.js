import { createRequire } from "module";
import dotenv from "dotenv";
import { pathsToModuleNameMapper } from "ts-jest";
dotenv.config();

const require = createRequire(import.meta.url);
const { compilerOptions } = require("./tsconfig.json");

const parseEnv = () =>
  Object.fromEntries(
    Object.entries(process.env).map(([key, val]) => {
      if (val === "true") return [key, true];
      if (val === "false") return [key, false];
      if (!isNaN(val)) return [key, +val];
      return [key, val];
    }),
  );

export const sharedGlobals = {
  __SERVER_PORT: process.env.SERVER_PORT,
  __DEV_MODE: process.env.DEV_MODE,
  "process.env": parseEnv(),
};

const config = {
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
