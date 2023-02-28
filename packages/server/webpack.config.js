// eslint-disable-next-line @typescript-eslint/no-require-imports,@typescript-eslint/no-var-requires
const path = require("path");
// eslint-disable-next-line @typescript-eslint/no-require-imports,@typescript-eslint/no-var-requires,node/no-unpublished-require,import/no-extraneous-dependencies
const HtmlWebpackPlugin = require("html-webpack-plugin");
// eslint-disable-next-line @typescript-eslint/no-require-imports,@typescript-eslint/no-var-requires,node/no-unpublished-require,import/no-extraneous-dependencies
const webpack = require("webpack");
// eslint-disable-next-line @typescript-eslint/no-require-imports,@typescript-eslint/no-var-requires,node/no-unpublished-require,import/no-extraneous-dependencies
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

const outputPath = path.resolve(__dirname, "dist");

// !!! This configuration is NOT production ready.

module.exports = {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    static: outputPath,
    client: {
      overlay: false,
      logging: "warn" // Want to set this to 'warn' or 'error'
    }
  },
  entry: {
    main: ["webpack-hot-middleware/client", "./webapp/App.tsx"],
  },
  output: {
    path: outputPath,
    filename: "[name].bundle.js",
    clean: true, // cleanup dist folder on each build
    publicPath: "/", // webpack-dev-server location
  },
  optimization: {
    runtimeChunk: "single",
  },
  resolve: {
    extensions: ["*", ".js", ".jsx", ".ts", ".tsx"],
  },
  module: {
    rules: [
      {
        test: /\.([jt]sx?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
          },
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
    ],
  },
  plugins: [
    new ReactRefreshWebpackPlugin({
      overlay: {
        sockIntegration: "whm",
      },
    }),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      title: "Code Challenge",
      template: path.resolve(__dirname, "webapp/index.html"),
    }),
  ],
};
