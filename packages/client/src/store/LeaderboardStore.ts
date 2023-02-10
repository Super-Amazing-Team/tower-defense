import { create } from "zustand";
import { getAllLeaderboard } from "@/api";

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
    const response = await getAllLeaderboard(body);
    set({ leaderboardAll: response.data });
  },
}));
