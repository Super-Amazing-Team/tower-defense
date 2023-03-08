import { create, StoreApi } from "zustand";
import {
  addToast,
  closeToast,
  useForumStore,
  useProfileStore,
  useSnackbarStore,
  useUserStore,
} from "./index";
import { ILayoutStore, useLayoutStore } from "@/store/layoutStore";

export interface IStateForServer {
  useUserStore: any;
  useSnackbarStore: any;
  useForumStore: any;
  addToast: any;
  useLayoutStore: StoreApi<ILayoutStore>;
  useProfileStore: any;
  closeToast: any;
}
export const getStore = () =>
  create(() => ({
    useLayoutStore: useLayoutStore,
    useUserStore: useUserStore,
    useSnackbarStore: useSnackbarStore,
    useForumStore: useForumStore,
    addToast: addToast,
    useProfileStore: useProfileStore,
    closeToast: closeToast,
  }));

export function getStateForServer() {
  return getStore().getState();
}
