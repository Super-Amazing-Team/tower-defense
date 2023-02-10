import { create } from "zustand";
import { ApiClient } from "@/api";

interface IBearsStore {
  leaderboardAll: unknown[] | unknown;
  getLeaderboardAll(body: {
    ratingFieldName: string;
    cursor: number;
    limit: number;
  }): Promise<void>;
}

export const useLeaderboardStore = create<IBearsStore>()((set) => ({
  leaderboardAll: [],
  getLeaderboardAll: async (body) => {
    const response = await ApiClient.getAllLeaderboard(body);
    set({ leaderboardAll: await response.data });
  },
}));
