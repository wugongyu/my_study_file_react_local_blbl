const webpack = require("webpack");
const merge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// webpack-node-externals 用来剔除 Node.js 原生模块的插件，它可以让你在服务器端应用程序中使用类似 Node.js 原生模块的代码，而无需将它们打包至 bundle 中
const nodeExternals = require('webpack-node-externals');

const baseWebpackConfig = require('./webpack.config.base');
const { styleLoaders } = require('./util');

const serverWebpackConfig = merge(baseWebpackConfig, {
  entry: {
    app: './src/entry-server.tsx',
  },
  output: {
    filename: 'entry-server.js',
    libraryTarget: 'commonjs2', // 打包成commonjs2规范
  },
  target: 'node', // 指定node运行环境
  //externals: 防止将某些 import 的包(package)打包到 bundle 中，而是在运行时(runtime)再去从外部获取这些扩展依赖
  externals: [
    nodeExternals({
      whitelist: [/\.css$/], // 忽略css模块，让webpack处理
    })
  ],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              babelrc: false,
              // babel-plugin-dynamic-import-node插件：解决热加载速度慢的问题
              plugins: [
                'dynamic-import-node',
                '@loadable/babel-plugin',
              ]
            },
          },
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true, // 只进行编译
            }
          },
          {
            loader: 'eslint-loader',
          }
        ],
        exclude: /node_modules/,
      },
      ...styleLoaders({
        sourceMap: false,
        usePostCSS: true,
        extract: true,
      })
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.REACT_ENV': JSON.stringify('server'), // 指定react环境为服务端
    }),
    // 服务端不支持window、document等对象，需将css外链
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[contenthash].css',
    })
  ]
});

module.exports = serverWebpackConfig;
