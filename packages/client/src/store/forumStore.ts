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
  fiveForums: IForumInfo[];
  allForums: IForumInfo[];
}

export interface ITopicStore {
  topic: IForum;
}

const getFiveForum = () => {
  return namesChatsMock.data.slice(0, 4);
};

const getAllForums = () => {
  return namesChatsMock.data;
};

export const useForumStore = create<IForumStore>()((set) => ({
  forums: namesChatsMock,
  isShowMoreForums: false,
  fiveForums: getFiveForum(),
  allForums: getAllForums(),
}));

export const useTopicStore = create<ITopicStore>()((set) => ({
  topic: forumMock,
}));
