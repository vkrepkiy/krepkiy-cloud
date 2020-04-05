const path = require("path");

function fromRoot(str) {
  return path.resolve(__dirname, str);
}

module.exports = {
  entry: {
    main: fromRoot("src/main.ts"),
  },
  resolve: {
    extensions: [".json", ".js", ".ts"],
  },
  output: {
    filename: "[name].bundle.js",
    path: fromRoot("build/app"),
  },
  experiments: {
    asset: true,
  },
  devtool: "source-map",
  devServer: {
    contentBase: fromRoot("build/app"),
    hot: true,
    writeToDisk: true,
  },
  module: {
    rules: [
      {
        test: /\.(html|css)/,
        type: "asset/source",
        generator: {
          filename: "static/[hash][ext]",
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
        include: fromRoot("src/css"),
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.tsx?$/,
        include: fromRoot("src"),
        use: [
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
              experimentalWatchApi: true,
            },
          },
        ],
      },
    ],
  },
};
