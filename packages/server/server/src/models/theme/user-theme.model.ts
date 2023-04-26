import {DataTypes} from "sequelize";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {sequelize} from "../../db/database.js";

export const UserThemeModel = sequelize.define(
  "user_theme",
  {
    themeId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: true
    },
  },
  {
    timestamps: false,
  }
);
