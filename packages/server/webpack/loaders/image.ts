import type { RuleSetRule } from "webpack";

import { IS_DEV } from "../constants";
import type { TLoader } from "../types";

const imageRegex = /\.(png|jpg|jpeg|gif)$/;

const universalLoader: RuleSetRule = {
  test: imageRegex,
  type: "asset/resource",
  generator: {
    filename: `images/${IS_DEV ? "[name][ext]" : "[name]-[hash][ext]"}`,
  },
};

export const imageLoader: TLoader = {
  client: universalLoader,
  server: universalLoader,
};
