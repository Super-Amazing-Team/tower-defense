import type {Request, Response} from "express";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {TopicModel} from "../../models/forum/topic.model.ts";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {SiteThemeModel} from "../../models/theme/site-theme.model.ts";

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
    const topics = await SiteThemeModel.findAll();
    return res.json(topics);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
