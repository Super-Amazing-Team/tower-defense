import { create } from "zustand";

interface IBearsStore {
  openSidebar: boolean;
  colorMode: () => "dark" | "light";
  setCloseSidebar(): void;
  setColorMode(newColorMode: "dark" | "light"): void;
  toggleSidebar(): void;
}

const getColorMode = () => {
  return () => (localStorage.getItem("mode") as "dark" | "light") || "light";
};

export const useLayoutStore = create<IBearsStore>()((set) => ({
  openSidebar: false,
  colorMode: getColorMode(),
  setCloseSidebar() {
    set(() => ({ openSidebar: false }));
  },
  toggleSidebar() {
    set(({ openSidebar }) => ({ openSidebar: !openSidebar }));
  },
  setColorMode(newColorMode: "dark" | "light") {
    localStorage.setItem("mode", newColorMode);
  },
}));
