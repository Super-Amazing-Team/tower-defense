/* eslint-disable */
import { defineConfig } from "vite";
import path from "path";
// import react from "@vitejs/plugin-react";
// import tsconfigPaths from "vite-tsconfig-paths";
// import eslintPlugin from "vite-plugin-eslint";

export default defineConfig({
  resolve:{
    alias: [
      {
        find: '@', replacement: path.resolve(__dirname, '../client/src')
      }
    ]
  }
});
