import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import CSSBaseLine from "@mui/material/CssBaseline";
import App from "@/App";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <CSSBaseLine>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </CSSBaseLine>
  </React.StrictMode>,
);
