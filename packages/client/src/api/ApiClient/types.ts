import type { z } from "zod";
import type { registerSchema, userSchema } from "./schema";

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
}
