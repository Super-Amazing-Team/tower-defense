import React, { createContext } from "react";
import ReactDOM from "react-dom/client";
import App from "@/App";
import { registerSW } from "@/utils";
import { createStore } from "zustand";
import { IStateForServer } from "@/store/ssr-store";

const MyContext = createContext({});
// @ts-ignore
const createMyStore = () => createStore(window.__ZUSTAND_STATE__);
const store = createMyStore().getState() as IStateForServer;
// @ts-ignore
console.log(createMyStore, window.__ZUSTAND_STATE__, store);

ReactDOM.hydrateRoot(
  document.getElementById("root") as HTMLElement,
  <React.StrictMode>
    <MyContext.Provider value={store}>
      <App />
    </MyContext.Provider>
  </React.StrictMode>,
);

registerSW();
