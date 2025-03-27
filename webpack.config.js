import path from "path";
import { fileURLToPath } from "url";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  mode: "development", // Change to "production" when deploying

  entry: {
    dom: "./Front-end/src/dom.js", // Corrected path
  },
  output: {
    path: path.resolve(__dirname, "Front-end/public"),
    filename: "js/[name].bundle.js", // Now generates dom.bundle.js & script.bundle.js
  },

  module: {
    rules: [
      // Bundle CSS and fonts
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
      {
        test: /\.ejs$/,
        use: [
          {
            loader: "html-loader",
          },
          {
            loader: "ejs-loader",
            options: {
              esModule: false, // Required to prevent the 'include' error
            },
          },
        ],
      },
    ],
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/styles.css", // This will bundle all your CSS into public/css/styles.css
    }),
    // Copy static assets (e.g., fonts and images)
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
