import { Router } from "express";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {
  createTopic,
  getAllTopic,
  getTopicById,
} from "../../controllers/topic/topic.controller.js";
import { auth } from "../../middlewares/auth.js";

export const topicRoutes = (router: Router) => {
  const topicRouter: Router = Router();

  topicRouter
    .post("/", auth, createTopic)
    .get("/", auth, getAllTopic)
    .get("/:id", getTopicById);

  router.use("/topic", topicRouter);
};
