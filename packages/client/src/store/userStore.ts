import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ApiClient } from "@/api/ApiClient";
import { addToast } from "@/store";
import { checkOnLine } from "@/utils";
import type { TNullable } from "@/utils";
import type { IEError } from "@/types";
import { IOauthSignInRequest } from "@/api/ApiClient/types";

interface IUserData {
  first_name: string;
  second_name: string;
  display_name: string;
  login: string;
  email: string;
  phone: string;
}

export interface IUser {
  login: string;
  avatar: TNullable<string>;
  display_name?: TNullable<string>;
  email: string;
  first_name: string;
  id: number;
  phone: TNullable<string>;
  second_name: string;

  isAuth: boolean;
}

interface IUserStore {
  user: IUser;
  login: (body: { login: string; password: string }) => void;
  logout: () => void;
  signUp: (body: {
    first_name: string;
    second_name: string;
    login: string;
    email: string;
    password: string;
    phone: string;
  }) => void;
  fetchUser: () => void;
  updateUser: (body: IUserData) => void;
  updateAvatar: (body: FormData) => void;
  oauthLogin: (body: IOauthSignInRequest) => void;
}

const initialUser = {
  login: "",
  avatar: null,
  display_name: "",
  email: "",
  first_name: "",
  id: 0,
  phone: "",
  second_name: "",
  isAuth: false,
};

export const useUserStore = create<IUserStore>()(
  persist(
    (set) => ({
      user: initialUser,
      login: async (body) => {
        try {
          await ApiClient.signIn(body);
          const data = await ApiClient.getUserInfo();
          set(() => ({
            user: {
              ...data,
              isAuth: true,
            },
          }));
        } catch (error: unknown) {
          addToast((error as IEError).response.data.reason);
        }
      },
      async logout() {
        const isOnLine = await checkOnLine();
        if (!isOnLine) return;
        try {
          await ApiClient.logout();
          set(() => ({
            user: initialUser,
          }));
        } catch (err) {
          console.error("Failed to logout: ", err);
        }
      },
      signUp: async ({
        login,
        password,
        first_name,
        second_name,
        email,
        phone,
      }) => {
        try {
          await ApiClient.signUp({
            login,
            password,
            first_name,
            second_name,
            email,
            phone,
          });
          const data = await ApiClient.getUserInfo();
          set(() => ({
            user: {
              ...data,
              isAuth: true,
            },
          }));
        } catch (error: unknown) {
          addToast((error as IEError).response.data.reason);
        }
      },
      fetchUser: async () => {
        try {
          const data = await ApiClient.getUserInfo();
          set(() => ({
            user: {
              ...data,
              isAuth: true,
            },
          }));
        } catch (error: unknown) {
          set(() => ({
            user: initialUser,
          }));
        }
      },
      updateUser: async (body: IUserData) => {
        try {
          const data = await ApiClient.changeUserProfile(body);
          set(({ user }) => ({
            user: {
              ...user,
              ...data,
              isAuth: true,
            },
          }));
        } catch {
          set(() => ({
            user: initialUser,
          }));
        }
      },
      updateAvatar: async (body) => {
        try {
          const data = await ApiClient.updateAvatar(body);
          set(() => ({
            user: {
              ...data,
              isAuth: true,
            },
          }));
        } catch (error: unknown) {
          addToast((error as IEError).response.data.reason);
        }
      },
      // Oauth
      oauthLogin: async (code: IOauthSignInRequest) => {
        try {
          await ApiClient.signInWithYandex(code);
          const data = await ApiClient.getUserInfo();
          set(() => ({
            user: {
              ...data,
              isAuth: true,
            },
          }));
        } catch {
          addToast("Failed to login OAuth");
        }
      },
    }),
    { name: "userStore", version: 1.1 },
  ),
);
