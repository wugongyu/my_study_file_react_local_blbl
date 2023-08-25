// webpack自定义插件：https://v4.webpack.docschina.org/contribute/writing-a-plugin/
//自定义ssr服务端渲染插件
const { isJS, validateConfig, onEmit } = require('./util');
module.exports = class SSRServerPlugin{
  constructor(opts){
    // 合并配置项（添加默认的文件名）
    this.options = Object.assign({
      filename: 'server-bundle.json',
    }, opts);
  }
  /**
   * compiler钩子https://v4.webpack.docschina.org/api/compiler-hooks/
   * compiler 对象包含了当前运行Webpack的配置，包括entry、output、loaders等配置，
   * 这个对象在启动Webpack时被实例化，而且是全局唯一的。
   * Plugin可以通过该对象获取到Webpack的配置信息进行处理。
  */
  apply(compiler){
    validateConfig(compiler);
    // 在emit阶段，可以读取最终需要输出的资源、chunk、模块和对应的依赖，如果有需要还可以更改输出资源
    onEmit(compiler, 'ssr-server-plugin', (compilation, callback) => {
       /**
        * compilation对象 表示单个构建的资产,compilation 实例能够访问所有的模块和它们的依赖（大部分是循环依赖）
          compilation对象可以理解为编译对象，
          包含了模块、依赖、文件等信息。
          在开发模式下运行Webpack时，每修改一次文件都会产生一个新的compilation对象，
          Plugin可以访问到本次编译过程中的模块、依赖、文件内容等信息。
       * 
       * */ 

      const stats = compilation.getStats().toJson();
      const { entrypoints, assets: statsAssets } = stats || {};
      const entrypointsKeys = Object.keys(entrypoints);
      const entryName = entrypointsKeys[0];
      const entryInfo = entrypoints[entryName];
      if(entrypointsKeys.length > 1) {
        throw new Error('Server-side bundle should have one single entry file. ')
      }
      // 通过callback回调告诉Webpack异步执行完毕　　　　
      if(!entryInfo){
        return callback();
      }

      const entryAssets = entryInfo.assets.filter(isJS);
      const bundle = {
        entry: entryAssets[0],
        files: {},
        maps: {},
      }
      // 处理文件
      statsAssets.forEach(asset => {
        const assetName = asset.name;
        const compilationAssets = compilation.assets[assetName].source();
        if(assetName.match(/\.js$/)){
          bundle.files[assetName] = compilationAssets;
        } else if(assetName.match(/\.js\.map$/)){
          bundle.maps[assetName.replace(/\.map$/, '')] = JSON.parse(compilationAssets)
        }
        // do not emit anything else for server
        delete compilation.assets[assetName];
      });

      if(Object.keys(bundle.files).length > 1) {
        throw new Error(
          "Server-side bundle should output one single file. " +
          "If you are using code splitting, you should use `dynamic-import-node` babel plugin. "
        );
      }

      const bundleJson = JSON.stringify(bundle, null, 2);
      // 通过操作compilation.assets对象，更改最终输出的资源。
      compilation.assets[this.options.filename] = {
        source: () => bundleJson,
        size: () => bundleJson.length,
      }
      callback();
    })
  }
}