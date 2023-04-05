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
  likeMessage: (body: ILikeMessage) => Promise<void>;
  dislikeMessage: (body: ILikeMessage) => Promise<void>;
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

export interface ILikeMessage {
  id: number;
  userId: string;
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
  likeMessage: async (body: ILikeMessage) => {
    let message = await ApiClient.likeMessage(body.id, body.userId);
    if (message.data.dislikes.includes(body.userId)) {
      message = await ApiClient.dislikeMessage(body.id, body.userId);
    }
    const messages = get().messages.map((mes) => {
      if (mes.id === body.id) {
        return message.data;
      }
      return mes;
    });
    set({ messages: messages });
  },
  dislikeMessage: async (body: ILikeMessage) => {
    let message = await ApiClient.dislikeMessage(body.id, body.userId);
    if (message.data.likes.includes(body.userId)) {
      message = await ApiClient.likeMessage(body.id, body.userId);
    }
    const messages = get().messages.map((mes) => {
      if (mes.id === body.id) {
        return message.data;
      }
      return mes;
    });
    set({ messages: messages });
  },
}));
