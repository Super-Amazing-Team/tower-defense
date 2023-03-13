/* eslint-disable */
// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
// import eslintPlugin from "vite-plugin-eslint";
// import dotenv from "dotenv";
// dotenv.config();
//
// // https://vitejs.dev/config/
// export default defineConfig({
//   server: {
//     port: Number(process.env.CLIENT_PORT) || 3000,
//   },
//   define: {
//     __SERVER_PORT__: process.env.SERVER_PORT || 3001,
//   },
//   plugins: [react(), eslintPlugin(), tsconfigPaths()],
// });

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  build: {
    minify: false,
    rollupOptions: {

    }
  },
})
