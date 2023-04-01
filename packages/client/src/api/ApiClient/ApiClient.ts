import { z } from "zod";
import APIService from "../baseService";
import ApiForumService from "../baseService/forum";
import { IApiClient } from "./types";
import { registerSchema, userSchema } from "./schema";
import { checkOnLine } from "@/utils";

export const ApiClient: IApiClient = {
  async signIn(body) {
    return APIService.post("/auth/signin", body);
  },
  async logout() {
    const isOnLine = await checkOnLine();
    if (isOnLine) {
      return APIService.post("/auth/logout");
    }
    return Promise.reject();
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
    return APIService.post("/leaderboard/superAmazingTeam", body);
  },
  async postLeaderboard(body) {
    return APIService.post("/leaderboard", body);
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
    const { data } = await APIService.put("/user/profile/avatar", body);
    await userSchema.parseAsync(data);
    return data;
  },

  // Oauth
  async getYandexServiceId(redirect_uri) {
    return APIService.get("/oauth/yandex/service-id", {
      params: { redirect_uri },
    });
  },
  async signInWithYandex(body) {
    return APIService.post("/oauth/yandex", body);
  },

  async getAllTopics() {
    return ApiForumService.get("/topic");
  },
  async getTopicById(body) {
    return ApiForumService.get(`/topic/${body}`);
  },
  async createTopic(body) {
    return ApiForumService.post(`/topic`, body);
  },
  async createMessage(body) {
    return ApiForumService.post(`/message`, body);
  },
};
