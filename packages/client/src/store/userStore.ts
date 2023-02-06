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
  logout: () => void;
}

const initialUser = {
  login: "",
  password: "",
  isAuth: false,
};

export const useUserStore = create<IUserStore>()(
  persist(
    (set) => ({
      user: initialUser,
      login: (login, password, isAuth) =>
        set(() => ({
          user: {
            login,
            password,
            isAuth: true,
          },
        })),
      logout: () =>
        set(() => ({
          user: initialUser,
        })),
    }),
    { name: "userStore", version: 1 },
  ),
);
