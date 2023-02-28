import { create } from "zustand";
import { ApiClient } from "@/api";

interface ILeaderboardStore {
  leaderboardAll: unknown[] | unknown;
  getLeaderboardAll(body: {
    ratingFieldName: string;
    cursor: number;
    limit: number;
  }): Promise<void>;
  postLeaderboard(body: {
    data: {
      score: number;
      name: string;
    };
    limit: number;
  }): Promise<void>;
}

export const useLeaderboardStore = create<ILeaderboardStore>()((set) => ({
  leaderboardAll: [],
  getLeaderboardAll: async (body) => {
    const response = await ApiClient.getAllLeaderboard(body);
    set({ leaderboardAll: response.data });
  },
  postLeaderboard: async (body) => {
    const { data, limit } = body;
    await ApiClient.postLeaderboard({
      data,
      ratingFieldName: "score",
      teamName: "superAmazingTeam",
    });
    const response = await ApiClient.getAllLeaderboard({
      ratingFieldName: "score",
      cursor: 0,
      limit,
    });
    set({ leaderboardAll: response.data });
  },
}));
