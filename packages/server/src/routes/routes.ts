import {Router} from "express";
import {themesRoutes} from "./theme/theme.routes";
import {topicRoutes} from "./topic/topic.routes";
import {messageRoutes} from "./message/message.routes";

const router: Router = Router();

themesRoutes(router);
topicRoutes(router);
messageRoutes(router);


export default router;
