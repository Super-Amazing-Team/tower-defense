import { create } from "zustand";
import { ApiClient } from "@/api";
import { ITopic } from "@/api/ApiClient/types";
export interface IForumStore {
  allTopics: ITopic[];
  isShowMoreForums: boolean;
  allForums: () => Promise<void>;
  createTopic: (body: ICreateTopic) => Promise<void>;
}

export interface ITopicStore {
  topic: ITopic;
  messages: IMessages[];
  getTopicById: (body: string) => Promise<void>;
  createMessage: (body: ICreateMessage) => Promise<void>;
}

export interface ICreateTopic {
  title: string;
  description: string;
  ownerId: string;
}

export interface ICreateMessage {
  message: string;
  ownerId: string;
  topicId: string;
}

const initialValueTopic: ITopic = {
  id: "",
  title: "",
  description: "",
  ownerId: "",
  messages: [],
};

const initialValueMessages: IMessages[] = [];

export interface IMessages {
  id: number;
  message: string;
  topicId: string;
  ownerId: string;
  date: string;
  likes: string[];
  dislikes: string[];
}

export const useForumStore = create<IForumStore>()((set, get) => ({
  allTopics: [],
  isShowMoreForums: false,
  allForums: async () => {
    const topics = await ApiClient.getAllTopics();
    set({ allTopics: topics.data });
  },
  createTopic: async (data: ICreateTopic) => {
    const topic = await ApiClient.createTopic(data);
    set({ allTopics: [...get().allTopics, topic.data] });
  },
}));

export const useTopicStore = create<ITopicStore>()((set, get) => ({
  topic: initialValueTopic,
  messages: initialValueMessages,
  getTopicById: async (body: string) => {
    const topicRes = await ApiClient.getTopicById(body);
    set({ topic: topicRes.data.topic, messages: topicRes.data.messages });
  },
  createMessage: async (body: ICreateMessage) => {
    const message = await ApiClient.createMessage(body);
    set({ messages: [...get().messages, message.data] });
  },
}));
