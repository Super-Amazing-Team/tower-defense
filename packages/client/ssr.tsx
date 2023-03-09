import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import React from "react";
import App from "./src/App";

export function render() {
  return renderToString(
    <StaticRouter location={{ pathname: "/" }}>
      <App />
    </StaticRouter>,
  );
}
