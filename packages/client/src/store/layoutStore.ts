import { create } from "zustand";

interface IBearsStore {
  openSidebar: boolean;
  colorMode: "dark" | "light";
  setCloseSidebar(): void;
  setColorMode(newColorMode: "dark" | "light"): void;
  toggleSidebar(): void;
}

function getLocalStorageMode() {
  const allowedModes: IBearsStore["colorMode"][] = ["light", "dark"];
  const savedMode = localStorage.getItem("mode") as IBearsStore["colorMode"];
  if (savedMode && allowedModes.includes(savedMode)) {
    return savedMode;
  }
  return "light";
}

export const useLayoutStore = create<IBearsStore>()((set) => ({
  openSidebar: false,
  colorMode: typeof window !== "undefined" ? getLocalStorageMode() : "light",
  setCloseSidebar() {
    set(() => ({ openSidebar: false }));
  },
  toggleSidebar() {
    set(({ openSidebar }) => ({ openSidebar: !openSidebar }));
  },
  setColorMode(newColorMode: "dark" | "light") {
    localStorage.setItem("mode", newColorMode);
    set(() => ({ colorMode: newColorMode }));
  },
}));
