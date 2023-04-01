import type {Request, Response} from "express";
import {CommentsModel} from "../../models/forum/comments.model";

export const createMessage = async (req: Request, res: Response) => {
  const { message, topicId, ownerId } = req.body;
  try {
    const messageRes = await CommentsModel.create({
      message,
      topicId,
      ownerId
    });

    return res.json(messageRes);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAllMessagesByTopicId = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const messages = await CommentsModel.findAll({
      where: {
        topicId: id
      }
    });

    return res.json(messages);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });

  }
}


export const likeMessage = (req: Request, res: Response) => {
  const { id } = req.params;
  const { userId } = req.body;
  try {
    const message = CommentsModel.findOne({
      where: {
        id
      },
    })
    return message.then((item: any) => {
      if (item && !item.likes.some((i: string) => i === userId)) {
        item.likes.push(userId);
        return CommentsModel.update(
          {likes: item.likes},
          {
            where: {
              id
            }
          }
        ).then(() => res.json(item))
      } if (item && item.likes.some((i: string) => i === userId)) {
        item.likes = item.likes.filter((i: string) => i !== userId);
        return CommentsModel.update(
          {likes: item.likes},
          {
            where: {
              id
            }
          }
        ).then(() => res.json(item))
      }
         return res.status(404).json({ message: "Not Found message" });

    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export const dislikeMessage = (req: Request, res: Response) => {
  const { id } = req.params;
  const { userId } = req.body;
  try {
    const message = CommentsModel.findOne({
      where: {
        id
      },
    })
    return message.then((item: any) => {
      if (item && !item.dislikes.some((i: string) => i === userId)) {
        item.dislikes.push(userId);
        return CommentsModel.update(
          {dislikes: item.dislikes},
          {
            where: {
              id
            }
          }
        ).then(() => res.json(item))
      } if (item && item.dislikes.some((i: string) => i === userId)) {
        // eslint-disable-next-line no-param-reassign
        item.dislikes = item.dislikes.filter((i: string) => i !== userId);
        return CommentsModel.update(
          {dislikes: item.dislikes},
          {
            where: {
              id
            }
          }
        ).then(() => res.json(item))
      }
        return res.status(404).json({ message: "Not Found message" });

    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}
