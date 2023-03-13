import dotenv from "dotenv";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import type { ViteDevServer } from "vite";

import express from "express";
import * as path from "path"
import * as fs from "fs"
//import { createClientAndConnect } from "./db";

const isDev = () => process.env.NODE_ENV === "development";

async function startServer() {
  dotenv.config();

  const app = express();
  app.use(cors());
  const port = Number(process.env.SERVER_PORT) || 3001;
  //createClientAndConnect();

  let vite: ViteDevServer | undefined;
  const srcPath = path.dirname(require.resolve("client"))
  // eslint-disable-next-line node/no-missing-require
  const ssrClientPath = require.resolve("client/ssr-dist/client.cjs");
  // eslint-disable-next-line node/no-missing-require
  const distPath = path.dirname(require.resolve("client/index.html"));

  if (isDev()) {
    vite = await createViteServer({
      server: { middlewareMode: true },
      root: srcPath,
      appType: "custom"
    })

    app.use(vite.middlewares)
  }

  app.get("/api", (_, res) => {
    res.json("👋 Howdy from the server :)");
  });

  if (!isDev()) {
    app.use("/assets", express.static(path.resolve(distPath, "assets")))
  }

  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      let template: string;

      if (!isDev()) {
        template = fs.readFileSync(
          path.resolve(distPath, "index.html"),
          "utf-8",
        )
      } else {
        template = fs.readFileSync(
          path.resolve(srcPath, "index.html"),
          "utf-8",
        )

        template = await vite!.transformIndexHtml(url, template)

      }

      let render: () => Promise<string>;

      if (!isDev()) {
        render = (await import(ssrClientPath)).render;
      } else {
        render = (await vite!.ssrLoadModule(path.resolve(srcPath, "ssr.tsx"))).render;
      }

      const appHtml = await render();

      const html = template.replace("<!--ssr-outlet-->",  appHtml)

      res.status(200).set({ "Content-Type": "text/html" }).end(html)
    } catch (e) {
      if (isDev()) {
        vite!.ssrFixStacktrace(e as Error)
      }
      next(e)
    }
  });

  app.listen(port, () => {
    console.log(`  ➜ 🎸 Server is listening on port: ${port}`);
  });
}

startServer();

