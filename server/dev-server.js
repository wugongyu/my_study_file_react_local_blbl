// 开发环境服务的启动
const path = require('path');
const webpack = require('webpack');
// node.js提供了file system模块可以对文件进行读写操作，但其在浏览器环境下不支持
// 故使用memory-fs来模拟文件系统
const MFS = require('memory-fs');
const clientConfig = require('../config/webpack.config.client');
const serverConfig = require('../config/webpack.config.server');

module.exports = function setupDevServer(expressApp, callback){
  let bundle; // 服务端打包后的文件
  let clientManifest; // 客户端打包后的文件
  let currentResolve;
  const readyPromise = new Promise((resolve) => currentResolve = resolve);

  const update = () => {
    if(bundle && clientManifest) {
      callback(bundle, clientManifest);
      currentResolve();
    }
  }

  const readFile = (fs, filename) => {
    return fs.readFileSync(path.join(clientConfig.output.path, filename), 'utf-8')
  }

  // 修改入口文件，增加热更新插件
  clientConfig.entry.app = ['webpack-hot-middleware/client', clientConfig.entry.app];
  clientConfig.output.filename = 'static/js/[name].[hash].js';
  clientConfig.plugins.push(new webpack.HotModuleReplacementPlugin());

  /**
   * 客户端打包
  */
  const clientCompiler = webpack(clientConfig);

  const devMiddleware = require('webpack-dev-middleware')(clientCompiler, {
    publicPath: clientConfig.output.publicPath,
    logLevel: 'warn',
  });

  // 使用webpack-dev-middleware中间件服务webpack打包后的资源文件
  expressApp.use(devMiddleware);  

  // 监听客户端打包，有更改就更新
  clientCompiler.hooks.done.tap('done', stats => {
    const info = stats.toJson();
    if(stats.hasWarnings()) {
      console.warn(info.warnings);
    }
    if(stats.hasErrors()){
      console.error(info.errors);
      return;
    }
    // 从webpack-dev-middleware中间件存储的内存中读取打包后的文件
    clientManifest = JSON.parse(readFile(devMiddleware.fileSystem, 'client-manifest.json'));
    update();
  });

  // 使用热更新中间件
  expressApp.use(require('webpack-hot-middleware')(clientCompiler));

  /**
   * 服务端打包
   * */ 
  const serverCompiler = webpack(serverConfig);
  // 使用内存文件系统
  const mfs = new MFS();
  serverCompiler.outputFileSystem = mfs;

  // 监听服务端打包入口文件，有更改就更新
  serverCompiler.watch({}, (err, stats) => {
    const info = stats.toJson();
    if(stats.hasWarnings()){
      console.warn(info.warnings);
    }
    if(stats.hasErrors()) {
      console.error(info.errors);
      return;
    }
    bundle = JSON.parse(readFile(mfs, 'server-bundle.json'));
    update();
  });

  return readyPromise;
}