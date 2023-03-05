import path from "path";

import type { Configuration } from "webpack";
import nodeExternals from "webpack-node-externals";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";

import {
  ALIAS,
  DIST_DIR,
  IS_DEV,
  SERVER_BUNDLE_NAME,
  SERVER_SRC_DIR,
} from "./constants";
import * as Loaders from "./loaders";

const serverConfig: Configuration = {
  name: "server",
  target: "node",
  node: { __dirname: false },
  entry: path.join(SERVER_SRC_DIR, "/index"),
  plugins: [new ForkTsCheckerWebpackPlugin()],
  module: {
    rules: Object.values(Loaders).map((el) => el.server),
  },
  output: {
    filename: `${SERVER_BUNDLE_NAME}.js`,
    path: DIST_DIR,
    publicPath: "/",
  },
  devtool: IS_DEV ? "source-map" : false,
  resolve: {
    alias: ALIAS,
    extensions: [".ts", ".tsx", ".js"],
  },
  externals: [nodeExternals()],
};

export { serverConfig };
