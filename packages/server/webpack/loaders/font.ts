import { IS_DEV } from "../constants";
import type { TLoader } from "../types";

const fontRegex = /\.(woff|woff2|ttf|otf|eot)$/;

export const fontLoader: TLoader = {
  client: {
    test: fontRegex,
    type: "asset/resource",
    generator: {
      filename: `fonts/${
        IS_DEV ? "[name][ext]" : "[name]-[contenthash][ext][query]"
      }`,
    },
  },
  server: {
    test: fontRegex,
    loader: "null-loader",
  },
};
