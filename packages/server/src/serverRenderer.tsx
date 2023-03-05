import { HelmetProvider, FilledContext } from "react-helmet-async";
import { renderToPipeableStream } from "react-dom/server";
import type { Request, Response, RequestHandler } from "express";
import { StaticRouter } from "react-router-dom/server";
import type { ChunkExtractor } from "@loadable/server";
import { getDataFromTree } from "@apollo/react-ssr";
import { getHtmlTemplate } from "./template";
import App from "./App";
import { ROUTE_CONSTANTS } from "../constants/routeConstants";

const serverRenderer =
  (chunkExtractor: ChunkExtractor): RequestHandler =>
  async (req: Request, res: Response) => {
    const isPageAvailable = (
      Object.values(ROUTE_CONSTANTS) as string[]
    ).includes(req.path);

    if (!isPageAvailable) {
      req.url = ROUTE_CONSTANTS.notFound;
    }

    const location: string = req.url;

    const helmetContext = {};

    const jsx = (
      <HelmetProvider context={helmetContext}>
        <StaticRouter location={location}>
          <App />
        </StaticRouter>
      </HelmetProvider>
    );

    await getDataFromTree(jsx);

    const { helmet } = helmetContext as FilledContext;

    const { header, footer } = getHtmlTemplate({
      helmetData: helmet,
      scriptTags: chunkExtractor.getScriptTags({
        nonce: res.locals.cspNonce,
      }),
      styleTags: chunkExtractor.getStyleTags(),
    });

    res.write(header);
    let didError = false;
    const stream = renderToPipeableStream(jsx, {
      onShellReady() {
        res.statusCode = didError ? 500 : 200;
        stream.pipe(res);
      },
      onAllReady() {
        res.end(footer);
      },
      onError(err) {
        didError = true;
        console.error(err);
      },
    });
  };

export { serverRenderer };
