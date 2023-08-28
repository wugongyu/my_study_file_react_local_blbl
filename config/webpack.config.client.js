const path = require('path');
const merge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// fork-ts-checker-webpack-plugin: 在 webpack 打包的同时支持 ts 类型检查
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const LoadablePlugin = require('@loadable/webpack-plugin');

const baseWebpackConfig = require('./webpack.config.base');
const { styleLoaders } = require('./util');

const isProd = process.env.NODE_ENV === 'production';
const resolvePath = function(relativePath){
  return path.resolve(__dirname, relativePath);
}

const clientWebpackConfig = merge(baseWebpackConfig, {
  entry: {
    app: './src/entry-client.tsx',
  },
  output: {
    filename: 'static/js/[name].[chunkhash].js',
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              babelrc: false,
              plugins: [
                '@loadable/babel-plugin'
              ]
            },
          },
          {
            loader: 'ts-loader',
            // 支持HMR和禁用类型检查，类型检查将使用ForkTsCheckerWebpackPlugin
            options: {
              transpileOnly: true,
            }
          },
          {
            loader: 'eslint-loader',
          }
        ],
        include: [ resolvePath("../src") ],
      },
      ...styleLoaders({
        sourceMap: false,
        usePostCSS: true,
        extract: !!isProd,
      })
    ],
  },
  optimization: {
    // 动态导入模块--通用分块策略
    splitChunks: {
      chunks: 'all', // include all types of chunks
      cacheGroups: {
        vendor: {
          test: function(module){
            // 阻止css文件打包到vendor chunk中
            if(module.resource && /\.css$/.test(module.resource)){
              return false;
            }
            // node_modules目录下的模块打包到vendor chunk中
            return module.context && module.context.includes('node_modules');
          }
        }
      }
    },
    // webpack引导模块
    runtimeChunk: {
      name: 'manifest',
    }
  },
  plugins: [
    // 在单独的进程中执行类型检查加快编译速度
    new ForkTsCheckerWebpackPlugin({
      async: false,
      tsconfig: resolvePath('../tsconfig.json'),
    }),
    new LoadablePlugin({
      filename: 'client-manifest.json',
    })
  ]
});

if(isProd){
  clientWebpackConfig.plugins.push(
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[contenthash].css'
    })
  )
}

module.exports = clientWebpackConfig;