import { create } from "zustand";

interface IBearsStore {
  bears: number;
  addOne(): void;
  increasePopulation(newBears: number): void;
  resetPopulation(): void;
}

export const useBearsStore = create<IBearsStore>()((set) => ({
  bears: 0,
  addOne() {
    set(({ bears }) => ({ bears: bears + 1 }));
  },
  increasePopulation(newBears: number) {
    set(({ bears }) => ({ bears: bears + newBears }));
  },
  resetPopulation() {
    set({ bears: 0 });
  },
}));
