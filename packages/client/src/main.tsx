import React, { createContext } from "react";
import ReactDOM from "react-dom/client";
import App from "@/App";
import { registerSW } from "@/utils";
import { getStateForServer } from "@/store/ssr-store";

const store = getStateForServer();
export const MyContext = createContext(store);

console.log(store);

ReactDOM.hydrateRoot(
  document.getElementById("root") as HTMLElement,
  <React.StrictMode>
    <MyContext.Provider value={store}>
      <App />
    </MyContext.Provider>
  </React.StrictMode>,
);

registerSW();
