import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const isTest = process.env.VITEST

export async function createServer(
  root = process.cwd(),
  isProd = process.env.NODE_ENV === "production",
  hmrPort = undefined
) {
  const resolve = (p) => path.resolve(__dirname, p)

  const indexProd = isProd
    ? fs.readFileSync(resolve("../client/dist/client/index.html"), "utf-8")
    : ""

  const app = express()

  /**
   * @type {import('vite').ViteDevServer}
   */
  let vite;
  if (!isProd) {
    vite = await (
      await import("vite")
    ).createServer({
      root,
      logLevel: isTest ? "error" : "info",
      server: {
        middlewareMode: true,
        watch: {
          // During tests we edit the files too fast and sometimes chokidar
          // misses change events, so enforce polling for consistency
          usePolling: true,
          interval: 100,
        },
        hmr: {
          port: hmrPort,
        },
      },
      appType: "custom",
    });
    // use vite's connect instance as middleware
    app.use(vite.middlewares);
  } else {
    app.use((await import("compression")).default());
    app.use(
      // @ts-ignore
      (await import("serve-static")).default(resolve("../client/dist/client"), {
        index: false,
      }),
    );
  }

  // eslint-disable-next-line consistent-return
  app.use("*", async (req, res) => {
    try {
      const url = req.originalUrl;

      let template; let render;
      if (!isProd) {
        // always read fresh template in dev
        template = fs.readFileSync(resolve("client/index.html"), "utf-8");
        template = await vite.transformIndexHtml(url, template);
        render = (await vite.ssrLoadModule("../client/ssr.jsx")).render;
      } else {
        template = indexProd;
        // @ts-ignore
        render = (await import("client/dist/server/ssr.js")).render;
      }

      const appHtml = render(url);
      const html = template.replace("<!--ssr-outlet-->", appHtml);

      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (e) {
      // eslint-disable-next-line no-unused-expressions
      // @ts-ignore
      // eslint-disable-next-line no-unused-expressions
      !isProd && vite.ssrFixStacktrace(e);
      // @ts-ignore
      console.log(e.stack);
      // @ts-ignore
      res.status(500).end(e.stack);
    }
  });

  // @ts-ignore
  return { app, vite };
}

if (!isTest) {
  createServer().then(({ app }) =>
    app.listen(5173, () => {
      console.log("http://localhost:5173");
    }),
  );
}
