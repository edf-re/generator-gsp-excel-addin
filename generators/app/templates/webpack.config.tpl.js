/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */

const devCerts = require("office-addin-dev-certs");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const copySettings = require('./copysettings');

const addInTemplateUrl="https://localhost:3000/"; // This can be changed to be more of a template
const serviceUrlTemplate="https://dev.edf-gsp.com/"; // This can be changed to be more of a template

const localMode = "local";
const devMode = "development";
const stageMode = "staging";
const prodMode = "production";

const configData = {};
configData[prodMode]  = { location: "https://office.<%= projectName %>.edf-re.com/",     serviceUrl: "https://edf-gsp.com",     buildIndicator: "prod" };
configData[stageMode] = { location: "https://office.<%= projectName %>.stg.edf-re.com/", serviceUrl: "https://stg.edf-gsp.com/", buildIndicator: "stg" };
configData[devMode]   = { location: "https://office.<%= projectName %>.dev.edf-re.com/", serviceUrl: "https://dev.edf-gsp.com/", buildIndicator: "dev" };
configData[localMode] = { location: "https://localhost:3000/",                      serviceUrl: "https://localhost:8000", buildIndicator: "local" };

let targetUrl;
let serviceUrl;
let buildType;

function getMode(mode) {
  if (configData[mode]) {
    return mode;
  }
  return localMode;
}

module.exports = async (env, options) => {
  const mode = getMode(env);
  console.log('---------------------------------------');
  console.log('---------------------------------------');
  console.log(`mode: ${mode}`);
  console.log('---------------------------------------');
  console.log('---------------------------------------');
  copySettings(mode);

  const data = configData[mode];

  targetUrl = data.location;
  serviceUrl = data.serviceUrl;
  buildType = data.buildIndicator;


  const config = {
    devtool: "source-map",
    entry: {
      polyfill: ["core-js/stable", "regenerator-runtime/runtime"],
      taskpane: "./src/taskpane/taskpane.ts",
      commands: "./src/commands/commands.ts",
      dialog: "./src/taskpane/fallbackAuthDialog.ts"
    },
    resolve: {
      extensions: [".ts", ".tsx", ".html", ".js"],
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-typescript"],
            },
          },
        },
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: "ts-loader",
        },
        {
          test: /\.html$/,
          exclude: /node_modules/,
          use: "html-loader",
        },
        {
          test: /\.(png|jpg|jpeg|gif)$/,
          loader: "file-loader",
          options: {
            name: "[path][name].[ext]",
          },
        },
      ],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        filename: "taskpane.html",
        template: "./src/taskpane/taskpane.html",
        chunks: ["polyfill", "taskpane"],
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: "./src/taskpane/taskpane.css",
            to: "taskpane.css",
          },
          {
            from: "manifest*.xml",
            to: "[name]." + buildType + ".[ext]",
            transform(content) {
              return content.
              toString().
              replace(new RegExp(addInTemplateUrl, "g"), targetUrl).
              replace(new RegExp(serviceUrlTemplate, "g"), serviceUrl);
            },
          },
        ],
      }),
      new HtmlWebpackPlugin({
        filename: "commands.html",
        template: "./src/commands/commands.html",
        chunks: ["polyfill", "commands"],
      })
      ,
      new HtmlWebpackPlugin({
        filename: "dialog.html",
        template: "./src/taskpane/dialog.html",
        chunks: ["polyfill", "dialog"],
      }),
    ],
    devServer: {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      https: options.https !== undefined ? options.https : await devCerts.getHttpsServerOptions(),
      port: process.env.npm_package_config_dev_server_port || 3000,
    },
  };

  return config;
};
