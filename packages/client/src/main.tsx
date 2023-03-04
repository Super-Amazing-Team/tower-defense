import React from "react";
import ReactDOM from "react-dom/client";
import App from "@/App";
import { registerSW } from "@/utils";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <App />,
);

registerSW();
