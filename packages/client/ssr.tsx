import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { Location } from "react-router-dom";
import App from "./src/App";

export function render(url: string | Partial<Location>, context: any) {
  return renderToString(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    <StaticRouter location={url} context={context}>
      <App />
    </StaticRouter>,
  );
}
