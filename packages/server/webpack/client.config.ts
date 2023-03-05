import path from "path";
import { Configuration, HotModuleReplacementPlugin, WebpackPluginInstance, DefinePlugin } from "webpack";
import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import LoadablePlugin from "@loadable/webpack-plugin";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
import HtmlWebpackPlugin from "html-webpack-plugin";

import { ALIAS, DEV_SERVER_PORT, DIST_DIR, IS_DEV, SRC_DIR } from "./constants";
import * as Loaders from "./loaders";

const withReport = Boolean(process.env.npm_config_withReport);

const entry: string[] = [
  path.resolve(SRC_DIR, "index.tsx"),
  ...(IS_DEV ? [
    ...(process.env.NO_SSR === "true" ? []
      : ["webpack-hot-middleware/client"]),
  ] : []),
];

const filename = (ext: string): string =>
  (IS_DEV ? `[name].${ext}` : `[name].[chunkhash].${ext}`);

const plugins: WebpackPluginInstance[] = [
  new DefinePlugin({
    NO_SSR: process.env.NO_SSR === "true",
  }),
  ...(process.env.NO_SSR === "true" ? [
    new HtmlWebpackPlugin({
      title: "My App",
      template: "./src/assets/index.html",
    }),
  ] : []),
  new ForkTsCheckerWebpackPlugin(),
  new LoadablePlugin(
    {
      filename: "stats.json",
      writeToDisk: true,
    }) as { apply(): void; },
  ...(IS_DEV ? [
    new HotModuleReplacementPlugin(),
    new ReactRefreshWebpackPlugin(),
  ] : [
    new BundleAnalyzerPlugin({ analyzerMode: withReport ? "server" : "disabled" }),
  ]),
];

const clientConfig: Configuration = {
  name: "client",
  target: "web",
  entry,
  plugins,
  output: {
    path: DIST_DIR,
    filename: filename("js"),
    publicPath: "/",
  },
  devtool: IS_DEV ? "source-map" : false,
  resolve: {
    alias: ALIAS,
    extensions: [".tsx", ".ts", ".js", ".scss", ".css"],
    fallback: {
      url: false,
      path: false,
    },
  },
  module: {
    rules: Object.values(Loaders).map(el => el.client),
  },
  ...(process.env.NO_SSR === "true"
    && {
      devServer: {
        historyApiFallback: true,
        port: DEV_SERVER_PORT,
      },
    }),
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          name: "vendors",
          test: /[\\/]node_modules[\\/]/,
          chunks: "all",
        },
      },
    },
  },
};

export { clientConfig };
