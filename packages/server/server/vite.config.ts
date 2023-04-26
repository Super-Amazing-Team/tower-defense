/* eslint-disable */
import { defineConfig } from "vite";
import react from '@vitejs/plugin-react'
import path from "path";
// import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
// import eslintPlugin from "vite-plugin-eslint";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  build: {
    minify: false,
  },
  resolve:{
    alias: [
      {
        find: '@', replacement: path.resolve(__dirname, '../client/src')
      }
    ],
    extensions: ['.ts', '.tsx']
  }
});
