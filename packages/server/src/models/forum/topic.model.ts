import {DataTypes} from "sequelize";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {sequelize} from "../../db/database.js";

export const TopicModel = sequelize.define(
  "topic",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },
    ownerId: {
      type: DataTypes.STRING,
    }
  },
  {
    timestamps: false,
  }
);
