import { create } from "zustand";

interface IBearsStore {
  openSidebar: boolean;
  colorMode: "dark" | "light";
  setCloseSidebar(): void;
  setColorMode(newColorMode: "dark" | "light"): void;
  toggleSidebar(): void;
}

export const useLayoutStore = create<IBearsStore>()((set) => ({
  openSidebar: false,
  colorMode:
    typeof window !== "undefined"
      ? (localStorage.getItem("mode") as "dark" | "light")
      : "light",
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
