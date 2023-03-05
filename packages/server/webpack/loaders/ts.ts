import type { RuleSetRule } from "webpack";

import { IS_SWC } from "../constants";
import type { TLoader } from "../types";

const tsRegex = /\.tsx?$/;

const universalLoader: RuleSetRule = {
  test: tsRegex,
  use: [
    IS_SWC
      ? {
          loader: "swc-loader",
        }
      : {
          loader: "ts-loader",
          options: {
            transpileOnly: true,
          },
        },
  ],
};

export const tsLoader: TLoader = {
  client: universalLoader,
  server: universalLoader,
};
