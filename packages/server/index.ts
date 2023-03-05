// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import path from "path";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import webpack from "webpack";
import "cross-fetch/polyfill";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import express, { RequestHandler } from "express";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import devMiddleware from "webpack-dev-middleware";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import hotMiddleware from "webpack-hot-middleware";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { ChunkExtractor } from "@loadable/server";

import { serverRenderer } from "./src/serverRenderer";
import { DIST_DIR, IS_DEV, SRC_DIR } from "./webpack/constants";

import { clientConfig as config } from "./webpack/client.config";

const compiler = webpack({ ...config, mode: "development" });
const { PORT = 3000 } = process.env;

export const devMiddlewareInstance = devMiddleware(compiler, {
  serverSideRender: true,
  writeToDisk: true,
  publicPath:
    config.output && config.output.publicPath
      ? String(config.output.publicPath)
      : "/",
});

const runServer = (hotReload?: () => RequestHandler[]) => {
  const app = express();
  const statsFile = path.resolve("./dist/stats.json");
  const chunkExtractor = new ChunkExtractor({ statsFile });

  app
    .use(express.json())
    .use(express.static(path.resolve(DIST_DIR)));

  if (IS_DEV) {
    if (hotReload) {
      app.get("/*", [...hotReload()]);
    }
  } else {
    app.get("/sw.js", (_req, res) => {
      res.sendFile(path.join(SRC_DIR, "sw.js"));
    });
  }

  app.get("/*", serverRenderer(chunkExtractor));

  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(
      `App listening on port ${PORT}! (render to stream)`,
    );
  });
};

if (IS_DEV) {
  (() => {
    devMiddlewareInstance.waitUntilValid(() => {
      runServer(() => [devMiddlewareInstance, hotMiddleware(compiler)]);
    });
  })();
} else {
  runServer();
}
