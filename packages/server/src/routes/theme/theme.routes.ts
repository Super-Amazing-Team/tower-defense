import {Router} from "express";
import {
  createTheme,
  getAllThemeSite,
  getMyTheme
} from "../../controllers/theme/theme.controller";


export const themesRoutes = (router: Router) => {
  const themesRouter: Router = Router();

  themesRouter
    .post("/", createTheme)
    .get("/:userId", getMyTheme)
    .get("/", getAllThemeSite)

  router.use("/theme", themesRouter);
};
