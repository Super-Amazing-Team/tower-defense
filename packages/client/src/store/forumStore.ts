import { create } from "zustand";
import { IDataNamesChats, namesChatsMock } from "@/pages/Forum/const";
export interface IForumStore {
  forums: IDataNamesChats;
}

export const useForumStore = create<IForumStore>()((store) => ({
  forums: namesChatsMock,
}));
