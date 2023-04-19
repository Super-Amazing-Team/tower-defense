import {Router} from "express";
import {
  createTheme,
  getAllThemeSite,
  getMyTheme
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
} from "../../controllers/theme/theme.controller.js";


export const themesRoutes = (router: Router) => {
  const themesRouter: Router = Router();

  themesRouter
    .post("/", createTheme)
    .get("/:userId", getMyTheme)
    .get("/", getAllThemeSite)

  router.use("/theme", themesRouter);
};
