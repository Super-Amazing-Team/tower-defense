import { create } from "zustand";
import { ApiClient } from "@/api";

interface ILeaderboardStore {
  leaderboardAll: unknown[] | unknown;
  getLeaderboardAll(body: {
    ratingFieldName: string;
    cursor: number;
    limit: number;
  }): Promise<void>;
}

export const useLeaderboardStore = create<ILeaderboardStore>()((set) => ({
  leaderboardAll: [],
  getLeaderboardAll: async (body) => {
    const response = await ApiClient.getAllLeaderboard(body);
    set({ leaderboardAll: response.data });
  },
}));
