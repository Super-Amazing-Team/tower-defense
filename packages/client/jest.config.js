import dotenv from "dotenv";
dotenv.config();

const config = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  testMatch: ["<rootDir>/src/**/*.test.{ts,tsx}"],
  globals: {
    __SERVER_PORT: process.env.SERVER_PORT,
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};
export default config;
