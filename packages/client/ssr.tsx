import { renderToString } from "react-dom/server";
import React, { createContext } from "react";
import App from "./src/App";
import { getStateForServer } from "@/store/ssr-store";

const store = getStateForServer();
export const MyContext = createContext(store);

console.log(store);

export function render(props: any) {
  return renderToString(
    <MyContext.Provider value={props}>
      <App />
    </MyContext.Provider>,
  );
}
