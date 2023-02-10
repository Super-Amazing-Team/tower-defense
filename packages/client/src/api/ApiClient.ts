import APIService from "./baseService";

const getAllLeaderboard = (body: {
  ratingFieldName: string;
  cursor: number;
  limit: number;
}) => APIService.post("/leaderboard/all", body);

export { getAllLeaderboard };
