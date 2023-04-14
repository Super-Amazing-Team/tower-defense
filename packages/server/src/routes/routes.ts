import {Router} from "express";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {themesRoutes} from "./theme/theme.routes.js";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {topicRoutes} from "./topic/topic.routes.js";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {messageRoutes} from "./message/message.routes.js";

const router: Router = Router();

themesRoutes(router);
topicRoutes(router);
messageRoutes(router);


export default router;
