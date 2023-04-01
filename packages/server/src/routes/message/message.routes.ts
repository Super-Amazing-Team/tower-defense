import {Router} from "express";

import {
  createMessage,
  dislikeMessage,
  getAllMessagesByTopicId,
  likeMessage
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
} from "../../controllers/message/message.controller.ts";

export const messageRoutes = (router: Router) => {
  const messageRouter: Router = Router();

  messageRouter
    .post("/", createMessage)
    .post("/like/:id", likeMessage)
    .post("/dislike/:id", dislikeMessage)
    .get("/topic/:id", getAllMessagesByTopicId)

  router.use("/message", messageRouter);
};
