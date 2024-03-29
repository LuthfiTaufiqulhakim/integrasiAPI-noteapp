const { merge } = require("webpack-merge");
const path = require("path");
const common = require("./webpack.common");

module.exports = merge(common, {
  output: {
    path: path.resolve(__dirname, "docs"),
    filename: "bundle.js",
  },
});
