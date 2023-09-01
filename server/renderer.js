const React = require('react');
const ReactDOMServer = require('react-dom/server');
const { matchRoutes } = require('react-router-config')
const { Helmet } = require('react-helmet');
const { ChunkExtractor, ChunkExtractorManager } = require('@loadable/server');

class ServerRenderer {
  constructor(bundle, template, manifest){
    this.template = template;
    this.manifest = manifest;
    this.serverEntry = this._createEntry(bundle);
  }
  _createEntry(bundle){
    const file = bundle.files[bundle.entry];

    // node 的vm内置模块：node存在一个vm虚拟环境的概念，用来运行额外的js文件，他可以保证javascript执行的独立性，不会被外部所影响
    // 读取内容并编译模块
    const vm = require('vm');
    const sandbox = {
      console,
      module,
      require,
    };
    vm.runInNewContext(file, sandbox);
    return sandbox.module.exports;
  }
  // 把组件渲染为 html字符串
  renderToString(request, staticContext){
    return new Promise((resolve, reject) => {
      const serverEntry = this.serverEntry;
      const { createApp, createStore, router } = serverEntry || {};
      const store = createStore({});

      const render = () => {
        let context = {}; // 存放组件内部路由相关属性，包括状态码，地址信息，重定向的url
        if(staticContext && staticContext.constructor === Object ) {
          Object.assign(context, staticContext);
        }
        let component = createApp(context, request.url, store);
        let extractor = new ChunkExtractor({
          stats: this.manifest,
          entrypoints: ['app'], // 入口entry
        });
        let root = ReactDOMServer.renderToString(
          React.createElement(ChunkExtractorManager, { extractor }, component)
        );
        // 当发生重定向时，静态路由会设置url
        if(context.url){
          resolve({
            error: { url: context.url }
          });
          return;
        }
        // 有statusCode代表路由匹配失败
        if(context.statusCode){
          resolve({
            error: { code: context.statusCode }
          })
        } else {
          // store.getState() 获取预加载的state，供客户端初始化
          resolve({
            error: undefined,
            html: this._generateHtml(root, extractor, store.getState())
          })
        }
      }
      let promises;
      // 匹配路由
      let matches = matchRoutes(router, request.path);
      promises = matches.map(({ route, match }) => {
        const { asyncData } = route;
        // match.params获取匹配的路由参数
        return asyncData ? asyncData(store, Object.assign(match.params, request.query)) : Promise.resolve(null);
      });

      // 执行所有的asyncData的请求
      Promise.all(promises).then(() => {
        // 异步数据请求完毕之后再进行页面的render
        render();
      }).catch((err) => {
        reject(err);
      })
    })
  }
  _generateHtml(root, extractor, initialState){
    // 必须在组件renderToString后获取
    let head = Helmet.renderStatic();
    const { title, meta, link } = head;
    // 替换注释节点为渲染后的html字符串
    return this.template.replace(/<title>.*<\/title>/, title.toString())
    .replace('<!--react-ssr-head-->',
    `${meta.toString()}\n${link.toString()}\n${extractor.getLinkTags()}\n${extractor.getStyleTags()}
    <script type='text/javascript'>
      window.__INITIAL_STATE__=${JSON.stringify(initialState)};
    </script>`)
    .replace('<!--react-ssr-outlet-->', 
    `<div>${root}</div>\n${extractor.getScriptTags()}`  
    )
  }
}

module.exports = ServerRenderer;
