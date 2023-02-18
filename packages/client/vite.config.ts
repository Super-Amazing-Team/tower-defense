/* eslint-disable */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import eslintPlugin from "vite-plugin-eslint";
import dotenv from "dotenv";
import { sharedGlobals } from "./jest.config";
dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: Number(process.env.CLIENT_PORT) || 3000,
  },
  define: sharedGlobals,
  plugins: [react(), eslintPlugin(), tsconfigPaths()],
});
