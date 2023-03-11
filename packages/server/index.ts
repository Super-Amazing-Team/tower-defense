import dotenv from "dotenv";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import type { ViteDevServer } from "vite";

import express from "express";
import * as path from "path"
import * as fs from "fs"
import type { StoreApi } from "zustand"
//import { createClientAndConnect } from "./db";
const isDev = () => process.env.NODE_ENV === "development";

export interface IStore {
  store: () => StoreApi<unknown>
}

async function startServer() {
  dotenv.config();

  const app = express();
  app.use(cors());
  const port = Number(process.env.SERVER_PORT) || 3001;

  let vite: ViteDevServer | undefined;
  const srcPath = path.dirname(require.resolve("client"))
  // eslint-disable-next-line node/no-missing-require
  const ssrClientPath = require.resolve("client/ssr-dist/client.cjs");
  // eslint-disable-next-line node/no-missing-require
  const distPath = path.dirname(require.resolve("client/dist/index.html"));

  //const store3 = require.resolve("client/src/store/ssr-store.ts");
  //const aaa = (await import(require.resolve("client/src/store/ssr-store.ts")));

  //console.log(store3);
  //console.log(aaa);

//createClientAndConnect();

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

      let render: (store: any) => Promise<string>;
      //const storeRender = (await vite!.ssrLoadModule(path.resolve(store2, "ssr-store.ts"))).getStateForServer;

      if (!isDev()) {
        render = (await import(ssrClientPath)).render;
      } else {
        render = (await vite!.ssrLoadModule(path.resolve(srcPath, "ssr.tsx"))).render;
      }

      const store = path.dirname(require.resolve("client/src/store/ssr-store.ts"));
      console.log(store)
      //const store: IStore = storeRender;

      const appHtml = await render(store);

      //const state = store;

      //const stateMarkup = `<script>window.__ZUSTAND_STATE__ = ${JSON.stringify(store)}</script>`;

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

