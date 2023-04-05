import type { z } from "zod";
import type { AxiosResponse } from "axios";
import type { registerSchema, userSchema } from "./schema";
import { ICreateMessage, ICreateTopic, IMessages } from "@/store/forumStore";

interface IBaseUser {
  first_name: string;
  second_name: string;
  login: string;
  email: string;
  phone: string;
}

interface ISignUp extends IBaseUser {
  password: string;
}

interface ITuneUser extends IBaseUser {
  display_name: string;
}

interface ISignIn {
  login: string;
  password: string;
}

interface IChangePass {
  oldPassword: string;
  newPassword: string;
}

interface ILeaderboard {
  ratingFieldName: string;
  cursor: number;
  limit: number;
}

interface ILeaderboardPost {
  data: {
    score: number;
    name: string;
  };
  ratingFieldName: string;
  teamName: string;
}

interface IYandexServiceId {
  service_id: string;
}

export interface IOauthSignInRequest {
  code: string;
  redirect_uri: string;
}

export interface ITopic {
  id: string;
  title: string;
  description: string;
  ownerId: string;
  messages?: IMessages[];
}

export interface ITopicRes {
  topic: ITopic;
  messages: IMessages[];
}

export interface IApiClient {
  signIn(body: ISignIn): Promise<void>;

  logout(): Promise<void>;

  signUp(body: ISignUp): Promise<z.infer<typeof registerSchema>>;

  getAllLeaderboard(body: ILeaderboard): Promise<any>; // TODO: when the leaderboard will be created, change types
  postLeaderboard(body: ILeaderboardPost): Promise<void>;

  getUserInfo(): Promise<z.infer<typeof userSchema>>;

  changeUserProfile(body: ITuneUser): Promise<z.infer<typeof userSchema>>;

  changeUserPassword(body: IChangePass): Promise<void>;

  updateAvatar(body: FormData): Promise<z.infer<typeof userSchema>>;

  getYandexServiceId(query: string): Promise<AxiosResponse<IYandexServiceId>>;

  signInWithYandex(body: IOauthSignInRequest): Promise<void>;

  getAllTopics(): Promise<AxiosResponse<ITopic[]>>;

  getTopicById(body: string): Promise<AxiosResponse<ITopicRes>>;

  createTopic(body: ICreateTopic): Promise<AxiosResponse<ITopic>>;

  createMessage(body: ICreateMessage): Promise<AxiosResponse<IMessages>>;

  likeMessage(id: number, userId: string): Promise<AxiosResponse<IMessages>>;

  dislikeMessage(id: number, userId: string): Promise<AxiosResponse<IMessages>>;
}
