import { create } from "zustand";
import {
  forumMock,
  IDataNamesChats,
  IForum,
  IForumInfo,
  namesChatsMock,
} from "@/pages/Forum/const";
export interface IForumStore {
  forums: IDataNamesChats;
  isShowMoreForums: boolean;
  getFiveForums: () => IForumInfo[];
  getAllForums: () => IForumInfo[];
}

export interface ITopicStore {
  topic: IForum;
}

export const useForumStore = create<IForumStore>()((store) => ({
  forums: namesChatsMock,
  isShowMoreForums: false,
  getFiveForums(): IForumInfo[] {
    return namesChatsMock.data.slice(0, 4);
  },
  getAllForums(): IForumInfo[] {
    return namesChatsMock.data;
  },
}));

export const useTopicStore = create<ITopicStore>()((store) => ({
  topic: forumMock,
}));
