const path = require("path");

module.exports = {
  entry: "./src/customVis.tsx",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      { test: /\.css$/i, use: ["style-loader", "css-loader"] },
      {
        test: /\.(woff|woff2|eot|otf|ttf)$/,
        type: "asset/inline",
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
};
