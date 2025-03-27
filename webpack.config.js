import path from "path";
import { fileURLToPath } from "url";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  mode: "development",

  entry: {
    dom: "./Front-end/src/dom.js",
  },
  output: {
    path: path.resolve(__dirname, "Front-end/public"),
    filename: "js/[name].bundle.js",
  },

  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.(woff|woff2|ttf|eot|otf)$/,
        type: "asset/resource",
        generator: {
          filename: "fonts/[name][ext]",
        },
      },
      {
        test: /\.(png|jpg|jpeg|svg|gif)$/,
        type: "asset/resource",
        generator: {
          filename: "images/[name][ext]",
        },
      },
    ],
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/styles.css",
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: "Front-end/src/fonts", to: "fonts" },
        { from: "Front-end/src/images", to: "images" },
      ],
    }),
  ],

  resolve: {
    extensions: [".js", ".json"],
  },
};
