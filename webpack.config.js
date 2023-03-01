const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

function fromRoot(str) {
  return path.resolve(__dirname, str);
}

const outDir = "build/app";

module.exports = {
  entry: {
    app: fromRoot("src/app/app.ts"),
  },
  resolve: {
    extensions: [".json", ".js", ".ts"],
  },
  output: {
    filename: "[name].bundle.js",
    path: fromRoot(outDir),
  },
  devtool: "source-map",
  devServer: {
    historyApiFallback: {
      index: "index.html",
    },
    compress: true,
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: fromRoot("src/static"), to: fromRoot(outDir) }],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(html|css)$/,
        include: fromRoot("src/app"),
        type: "asset/source",
        generator: {
          filename: "[hash][ext]",
        },
      },
      {
        test: /\.svg$/,
        type: "asset/inline",
      },
      {
        test: /\.png$/,
        type: "asset/resource",
      },
      {
        test: /\.ts$/,
        include: fromRoot("src"),
        use: [
          {
            loader: "ts-loader",
          },
        ],
      },
    ],
  },
};
