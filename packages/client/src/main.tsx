import React from "react";
import ReactDOM from "react-dom/client";
import CSSBaseLine from "@mui/material/CssBaseline";
import App from "@/App";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <CSSBaseLine>
      <App />
    </CSSBaseLine>
  </React.StrictMode>,
);
