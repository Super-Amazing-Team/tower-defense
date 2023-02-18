import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ApiClient } from "@/api/ApiClient";
import { addToast } from "@/store";
import type { TNullable } from "@/utils";
import type { IEError } from "@/types";

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
  display_name?: string;
  email: string;
  first_name: string;
  id: number;
  phone: string;
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
}

const { changeUserProfile, getUserInfo, logout, signIn, signUp } = ApiClient;

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
    (set, get) => ({
      user: initialUser,
      login: async (body) => {
        try {
          await signIn(body);
          const data = await getUserInfo();
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
        await logout().catch((err) => console.error("Failed to logout: ", err));
        set(() => ({
          user: initialUser,
        }));
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
          await signUp({
            login,
            password,
            first_name,
            second_name,
            email,
            phone,
          });
          const data = await getUserInfo();
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
          if (!navigator.onLine) return;
          const response = await getUserInfo();
          set(() => ({
            user: {
              ...response,
              isAuth: true,
            },
          }));
        } catch (error: unknown) {
          get().logout();
          addToast((error as IEError).response.data.reason);
        }
      },
      updateUser: async (body: IUserData) => {
        try {
          const data = await changeUserProfile(body);
          set(() => ({
            user: {
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
    }),
    { name: "userStore", version: 1.1 },
  ),
);
