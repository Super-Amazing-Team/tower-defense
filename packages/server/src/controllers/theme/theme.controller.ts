import type {Request, Response} from "express";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {SiteThemeModel} from "../../models/theme/site-theme.model.js";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {UserThemeModel} from "../../models/theme/user-theme.model.js";

const updateMyTheme = (userId: string, themeId: string) => {
  try {
    const userTheme = UserThemeModel.findOne({
      where: { userId }
    });
    userTheme.then((val: any) => {
      if (val) {
        UserThemeModel.update(
          {themeId},
          {
            where: {
              userId,
            },
          }
        )
      } else {
        UserThemeModel.create({
          themeId,
          userId,
        });
      }
    })
  } catch (error: any) {
    console.log(error, "Ошибка создания/обновлению темы пользователя");
  }

}
export const createTheme = async (req: Request, res: Response) => {
  const { theme, description, userId } = req.body;
  try {
    const newTheme = await SiteThemeModel.create({
      theme,
      description,
      userId
    });
    const themeId: number = newTheme.get("id") as number;
    updateMyTheme(userId, themeId.toString())
    return res.json(newTheme);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// eslint-disable-next-line consistent-return
export const getMyTheme = async (req: any, res: any) => {
  const { userId } = req.params;
  try {
    const theme = await UserThemeModel.findOne({
      where: { userId },
    });
    const themeId: string = theme?.get("themeId") as string;
    const themeSite = await SiteThemeModel.findByPk(themeId)
    res.json(themeSite);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// eslint-disable-next-line consistent-return
export const getAllThemeSite = async (_req: any, res: any) => {
  try {
    const theme = await SiteThemeModel.findAll({
      attributes: [
        "id",
        "theme",
        "description",
      ],
    });
    res.json(theme);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

