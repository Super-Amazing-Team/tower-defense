/* eslint-disable */
import * as path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import eslintPlugin from "vite-plugin-eslint";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), eslintPlugin(), tsconfigPaths()],
  build: {
    lib: {
      entry: path.resolve(__dirname, "ssr.tsx"),
      name: "Client",
      formats: ["cjs"],
    },
    rollupOptions: {
      output: {
        dir: "ssr-dist",
      },
      external: ["react", "react-dom"],
    },
  },
});
