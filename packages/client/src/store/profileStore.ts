import { create } from "zustand";
import { ApiClient } from "@/api";
import { addToast } from "@/store";
import { IEError } from "@/types";

export interface IProfileStore {
  isEditMode: boolean;
  updateEditMode(val: boolean): void;
  updatePassword: (body: { oldPassword: string; newPassword: string }) => void;
}

export const useProfileStore = create<IProfileStore>()((set) => ({
  isEditMode: false,
  updateEditMode(isEditMode: boolean) {
    set({ isEditMode });
  },
  updatePassword: async (body) => {
    try {
      await ApiClient.changeUserPassword(body);
    } catch (error: unknown) {
      addToast((error as IEError).response.data.reason);
    }
  },
}));
