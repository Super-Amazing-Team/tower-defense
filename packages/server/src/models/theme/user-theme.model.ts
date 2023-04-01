import {DataTypes} from "sequelize";
import {sequelize} from "../../db/database";

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
