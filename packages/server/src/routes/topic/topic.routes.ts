import {Router} from "express";
import { createTopic, getAllTopic } from "../../controllers/topic/topic.controller";


export const topicRoutes = (router: Router) => {
  const topicRouter: Router = Router();

  topicRouter
    .post("/", createTopic)
    .get("/", getAllTopic)

  router.use("/topic", topicRouter);
};
