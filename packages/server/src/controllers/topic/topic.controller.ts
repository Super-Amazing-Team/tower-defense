import type {Request, Response} from "express";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {TopicModel} from "../../models/forum/topic.model.ts";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { CommentsModel } from "../../models/forum/comments.model.ts"

export const createTopic = async (req: Request, res: Response) => {
  const { title, description, ownerId } = req.body;
  try {
    const topic = await TopicModel.create({
      title,
      description,
      ownerId
    });

    return res.json(topic);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAllTopic = async (_req: Request, res: Response) => {
  try {
    const topics = await TopicModel.findAll();
    return res.json(topics);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const getTopicById = async (req: Request, res: Response) => {
  const { id} = req.params;
  try {
    const topic = await TopicModel.findByPk(id);
    const messages = await CommentsModel.findAll({
      where: {
        topicId: id
      }
    });
    return res.json({ topic, messages });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
