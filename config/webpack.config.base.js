const webpack = require('webpack');
const path = require('path');
// terser-webpack-plugin: 移除console相关代码，移除自动断点功能，多进程并发运行提高构建速度等。
const TerserPlugin = require('terser-webpack-plugin');
// optimize-css-assets-webpack-plugin: 压缩css文件
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

let env = 'dev';
let isProd = false;
if(process.env.NODE_ENV === 'production') {
  env = 'pro';
  isProd = true;
}

module.exports = {
  mode: isProd ? 'production' : 'development',
  devtool: isProd ? '#source-map' : '#cheap-module-source-map',
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/dist/',
  },
  // 模块解析配置
  resolve: {
    // 自动解析确定的扩展，在引用相关模块时可不带扩展
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|git|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 2048,
          name: 'static/img/[name].[hash:7].[ext]',
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)$/,
        loader: 'url-loader',
        options: {
          limit: 1,
          name: 'static/fonts/[name].[hash:7].[ext]',
        }
      }
    ]
  },
  optimization: {
    // mode 为production时自动启用
    // 使用 TerserPlugin 压缩 bundle
    minimizer: [
      new TerserPlugin({
        sourceMap: true, // Must be set to true if using source-maps in production
      }),
      new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: {
          map: false,
        },
      })
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('./' + env + '.env'),
    })
  ]
}