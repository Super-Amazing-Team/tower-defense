import { create } from "zustand";

export interface IProfileUser {
  email: string;
  login: string;
  first_name: string;
  second_name: string;
  phone?: string;
  avatar?: string;
}
export interface IProfileStore {
  user: IProfileUser;
  isEditMode: boolean;
  updateUserProfile(value: IProfileUser): void;
  updateEditMode(val: boolean): void;
}

const userConst: IProfileUser = {
  first_name: "Ilon",
  second_name: "Mask",
  email: "i_am_superman@gmail.ru",
  phone: "+19990001122",
  login: "superMan",
  avatar:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Elon_Musk_Royal_Society_%28crop2%29.jpg/274px-Elon_Musk_Royal_Society_%28crop2%29.jpg",
};

export const useProfileStore = create<IProfileStore>()((set) => ({
  user: userConst,
  isEditMode: false,
  updateUserProfile(user: IProfileUser) {
    set({ user });
  },
  updateEditMode(isEditMode: boolean) {
    set({ isEditMode });
  },
}));
