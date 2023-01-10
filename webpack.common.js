const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');


module.exports = {
  // Note: 
  // Chrome MV3 no longer allowed remote hosted code
  // Using module bundlers we can add the required code for your extension
  // Any modular script should be added as entry point
  entry: {
    firebase_config: './src/popup_views/firebase_config.js',
    login: './src/popup_views/login/login.js',
    main_script: './src/popup_views/main/main-script.js',
    content_script: './src/content/content-script.js',
    content: './src/content/content.js',
    foreground: './src/content/foreground.js',
    settings_script: './src/popup_views/settings/settings-script.js',
    options: './src/options/options.js',
  },
  plugins: [
    new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "popup_views", "login", "login.html"),
      filename: "login.html",
      chunks: ["login"] // This is script from entry point
    }),
    // Note: you can add as many new HtmlWebpackPlugin objects  
    // filename: being the html filename
    // chunks: being the script src
    // if the script src is modular then add it as the entry point above
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "options", "options.html"),
      filename: "options.html",
      chunks: ["options"] // This is script from entry point
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "popup_views", "main", "main.html"),
      filename: "main.html",
      chunks: ["main_script"] // This is script from entry point
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "popup_views", "settings", "settings.html"),
      filename: "settings.html",
      chunks: ["settings_script"] // This is script from entry point
    }),
    // Note: This is to copy any remaining files to bundler
    new CopyWebpackPlugin({
      patterns: [
        { from: './src/manifest.json' },
        { from: './src/background/background.js' },
        { from: './src/icons/*' },
        { from: './src/css/*' }
      ],
    }),
  ],
  output: {
    // chrome load uppacked extension looks for files under dist/* folder
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
};