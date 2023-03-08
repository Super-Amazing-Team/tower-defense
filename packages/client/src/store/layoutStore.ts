import { create } from "zustand";

export interface ILayoutStore {
  openSidebar: boolean;
  colorMode: "dark" | "light";
  setCloseSidebar(): void;
  setColorMode(newColorMode: "dark" | "light"): void;
  toggleSidebar(): void;
}

const getColorMode = () => {
  debugger;
  return (localStorage.getItem("mode") as "dark" | "light") || "light";
};

export const useLayoutStore = create<ILayoutStore>()((set) => ({
  openSidebar: false,
  colorMode: getColorMode(),
  setCloseSidebar() {
    set(() => ({ openSidebar: false }));
  },
  toggleSidebar() {
    set(({ openSidebar }) => ({ openSidebar: !openSidebar }));
  },
  setColorMode(newColorMode: "dark" | "light") {
    set(() => {
      localStorage.setItem("mode", newColorMode);
      return {
        colorMode: newColorMode,
      };
    });
  },
}));
