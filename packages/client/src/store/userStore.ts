import { create } from "zustand";
import { persist } from "zustand/middleware";

interface IUser {
  login: string;
  password: string;
  isAuth: boolean;
}

interface IUserStore {
  user: IUser;
  login: (login: string, password: string, isAuth: boolean) => void;
  logout(): void;
}

export const useUserStore = create<IUserStore>()(
  persist(
    (set) => ({
      user: {
        login: "",
        password: "",
        isAuth: false,
      },
      login: (login: string, password: string, isAuth: boolean) =>
        set(({ user }) => ({
          user: {
            login,
            password,
            isAuth: true,
          },
        })),
      logout() {
        set({
          user: {
            login: "",
            password: "",
            isAuth: false,
          },
        });
      },
    }),
    { name: "userStore", version: 1 },
  ),
);
