import {Router} from "express";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { createTopic, getAllTopic, getTopicById } from "../../controllers/topic/topic.controller.ts"


export const topicRoutes = (router: Router) => {
  const topicRouter: Router = Router();

  topicRouter
    .post("/", createTopic)
    .get("/", getAllTopic)
    .get("/:id", getTopicById)

  router.use("/topic", topicRouter);
};
