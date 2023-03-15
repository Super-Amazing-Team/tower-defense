import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { Location } from "react-router-dom";
import App from "./src/App";

export function render(url: string | Partial<Location>) {
  return renderToString(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>,
  );
}
