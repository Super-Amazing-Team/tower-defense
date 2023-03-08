import { create, StoreApi } from "zustand";
import {
  addToast,
  closeToast,
  useForumStore,
  useProfileStore,
  useSnackbarStore,
  useUserStore,
} from "./index";
import { useLayoutStore } from "@/store/layoutStore";

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
