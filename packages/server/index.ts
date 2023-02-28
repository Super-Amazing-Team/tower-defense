// eslint-disable-next-line @typescript-eslint/no-require-imports,@typescript-eslint/no-var-requires
const express = require("express");
// eslint-disable-next-line @typescript-eslint/no-require-imports,node/no-unpublished-require,@typescript-eslint/no-var-requires,import/no-extraneous-dependencies
const webpack = require("webpack");
// eslint-disable-next-line @typescript-eslint/no-require-imports,node/no-unpublished-require,@typescript-eslint/no-var-requires,import/no-extraneous-dependencies
const webpackDevMiddleware = require("webpack-dev-middleware");
// eslint-disable-next-line @typescript-eslint/no-require-imports,node/no-unpublished-require,@typescript-eslint/no-var-requires,import/no-extraneous-dependencies
const webpackHotMiddleware = require("webpack-hot-middleware");

const app = express();
// eslint-disable-next-line @typescript-eslint/no-require-imports,@typescript-eslint/no-var-requires
const config = require("./webpack.config.js");

const compiler = webpack(config);
const port = process.env.PORT || 3000;

// Tell express to use the webpack-dev-middleware and use the webpack.config.js
// configuration file as a base.
app.use(
  webpackDevMiddleware(compiler, { publicPath: config.output.publicPath }),
);
app.use(webpackHotMiddleware(compiler));

// add endpoints and such here

app.listen(port, () => {
  console.log(`express listening on port ${port}\n`);
});
