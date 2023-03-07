import { renderToString } from "react-dom/server";
import { createStore, useStore } from "zustand";
import React, { createContext, useContext, useRef } from "react";
import App from "./src/App";
import { getStore } from "@/store/ssr-store";

const MyContext = createContext({});
// const createMyStore = () => createStore(getStore);
// const store = createMyStore().getState().getState().store;

export function render(store: any) {
  return renderToString(
    <MyContext.Provider value={store}>
      <App />
    </MyContext.Provider>,
  );
}
