import { z } from "zod";
import APIService from "../baseService";
import { IApiClient } from "./types";
import { registerSchema, userSchema } from "./schema";

export const ApiClient: IApiClient = {
  async signIn(body) {
    return APIService.post("/auth/signin", body);
  },
  async logout() {
    return APIService.post("/auth/logout");
  },
  async signUp(body) {
    const { data } = await APIService.post<z.infer<typeof registerSchema>>(
      "/auth/signup",
      body,
    );
    await registerSchema.parseAsync(data);
    return data;
  },
  async getAllLeaderboard(body) {
    return APIService.post("/leaderboard/all", body);
  },
  async getUserInfo() {
    const { data } = await APIService.get<z.infer<typeof userSchema>>(
      "/auth/user",
    );
    await userSchema.parseAsync(data);
    return data;
  },
  async changeUserProfile(body) {
    const { data } = await APIService.put<z.infer<typeof userSchema>>(
      "/user/profile",
      body,
    );
    await userSchema.parseAsync(data);
    return data;
  },
  async changeUserPassword(body) {
    return APIService.put("/user/password", body);
  },
  async updateAvatar(body) {
    return APIService.put("/user/profile/avatar", body);
  },
};
