import ApiServices from "./baseService";
import type { IApiService } from "./baseService";

class ApiClient {
  APIService: IApiService;

  constructor() {
    this.APIService = ApiServices;
  }

  /** @description POST   /leaderboard/all   Get all leaderboard */
  getAllLeaderboard(body: {
    ratingFieldName: string;
    cursor: number;
    limit: number;
  }) {
    return this.APIService.post("/leaderboard/all", body);
  }
}

export default new ApiClient();
