import express from "express"
import type { Request, Response, Express } from "express";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { ViteDevServer } from "vite";
import { sequelize } from "./src/db/database";
import router from "./src/routes/routes";
// import { limiter } from "./src/middlewares/limiter.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isTest = process.env.VITEST;
await sequelize.sync({ force: false });
// const sequelizeOptions: SequelizeOptions = {
//   host: "localhost",
//   port: 5432,
//   username: "postgres",
//   password: "rootroot",
//   database: "tower",
//   dialect: "postgres", // 'mysql', 'sqlite', 'mariadb', 'mssql'
// };
// export const sequelize = new Sequelize(sequelizeOptions);
export async function createServer(
  root = process.cwd(),
  isProd = process.env.NODE_ENV === "production",
  hmrPort = undefined,
): Promise<{ app: Express; vite: ViteDevServer | undefined }> {
  const resolve = (p: string) => path.resolve(__dirname, p);

  const indexProd = isProd
    ? fs.readFileSync(resolve("../../client/dist/client/index.html"), "utf-8")
    : "";

  const app = express();

  /**
   * @type {import('vite').ViteDevServer}
   */
  let vite: ViteDevServer | undefined;
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
      (await import("serve-static")).default(
        resolve("../../client/dist/client"),
        {
          index: false,
        },
      ),
    );
  }
  if (!isProd) {
    app.use("/assets", express.static(resolve("../client/dist/client/assets")))
  }

  // middleware
  //app.use(limiter);
  app.use(express.json());

// routes
 app.use(router);

  // eslint-disable-next-line consistent-return
  app.use("*", async (req: Request, res: Response) => {
    try {
      const url = req.originalUrl;

      let template;
      let render;
      if (!isProd) {
        // always read fresh template in dev
        template = fs.readFileSync(resolve("../client/dist/client/index.html"), "utf-8");
        template = await vite!.transformIndexHtml(url, template);
        render = (await vite!.ssrLoadModule("../client/ssr.tsx")).render;
      } else {
        template = indexProd;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        /* @ts-ignore */
        render = (await import("client/dist/server/ssr.js")).render;
      }

      const context = {
        url: "",
      };
      const appHtml = render(url, context);

      if (context.url) {
        // Somewhere a `<Redirect>` was rendered
        return res.redirect(301, context.url);
      }

      const html = template.replace("<!--ssr-outlet-->", appHtml);

      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (e: any) {
      // eslint-disable-next-line no-unused-expressions
      !isProd && vite!.ssrFixStacktrace(e);
      console.log(e.stack);
      res.status(500).end(e.stack);
    }
  });

  return { app, vite };
}

if (!isTest) {
  createServer().then(({ app }) =>
    app.listen(5173, () => {
      console.log("http://localhost:5173");
    }),
  );
}
