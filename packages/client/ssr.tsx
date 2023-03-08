import { renderToString } from "react-dom/server";
import React from "react";
import App from "./src/App";

export function render() {
  return renderToString(<App />);
}
