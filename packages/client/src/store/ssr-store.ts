import { create } from "zustand";
import * as store from "./index";

export interface IStateForServer {
  useUserStore: any;
  useSnackbarStore: any;
  useForumStore: any;
  addToast: any;
  useLayoutStore: any;
  useProfileStore: any;
  closeToast: any;
}
export const getStore = () =>
  create(() => ({
    store: store,
  }));

export function getStateForServer(): IStateForServer {
  return getStore().getState().store;
}
