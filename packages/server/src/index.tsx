import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { loadableReady } from "@loadable/component";

import App from "./App";

const indexJSX = (
  <StrictMode>
      <HelmetProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </HelmetProvider>
  </StrictMode>
);

const container = document.getElementById("root");
declare const NO_SSR: boolean;
// eslint-disable-next-line no-undef
if (NO_SSR) {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  createRoot(container!).render(indexJSX);
} else {
  loadableReady(() => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    hydrateRoot(container!, indexJSX);
  });
}
