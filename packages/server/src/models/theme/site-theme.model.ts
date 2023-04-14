import {DataTypes} from "sequelize";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {sequelize} from "../../db/database.js";

export const SiteThemeModel = sequelize.define(
  "site_theme",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    theme: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },
    userId: {
      type: DataTypes.STRING,
    }
  },
  {
    timestamps: false,
  }
);
