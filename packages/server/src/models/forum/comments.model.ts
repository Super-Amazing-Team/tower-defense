import {DataTypes} from "sequelize";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {sequelize} from "../../db/database.js";

export interface ICommentsModel {
  id: number;
  message: string;
  topicId: string;
  ownerId: string;
  likes: string[];
  dislikes: string[];
}
export const CommentsModel = sequelize.define(
  "comments",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    message: {
      type: DataTypes.STRING,
    },
    topicId: {
      type: DataTypes.STRING,
    },
    ownerId: {
      type: DataTypes.STRING,
    },
    likes: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    dislikes: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    }
  },
  {
    timestamps: false,
  }
);
