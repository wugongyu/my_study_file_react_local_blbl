const express = require('express');
const fs = require('fs');
const path = require('path');
const ServerRenderer = require('./renderer');
const app = express();

const isProd = process.env.NODE_ENV === 'production';

let renderer;
let readyPromise;
let template = fs.readFileSync('./templates/index.html', 'utf-8');

// 生产环境
if(isProd){
  // 静态资源映射到dist目录下
  app.use('/dist', express.static(path.join(__dirname, '../dist')));
  const bundle = require('../dist/server-bundle.json'); // 服务端打包的文件
  const clientManifest = require('../dist/client-manifest.json'); // 客户端打包的文件
  renderer = new ServerRenderer(bundle, template, clientManifest);
} else {
// 开发环境
  readyPromise = require('./dev-server')(app, (bundle, clientManifest) => {
    renderer = new ServerRenderer(bundle, template, clientManifest);
  })
}

// 公共资源映射到public目录下
app.use('/public', express.static(path.join(__dirname, '../public')));

const render = (req, res) => {
  console.log('=======enter server=======');
  console.log('visit url: ', req.url);

  let picSuffix = '.jpg';
  const userAgent = req.get('User-Agent');
  if(userAgent){
    if(/iPhone|iPad|iPod|iOS/i.test(userAgent)){
      picSuffix = '.jpg';
    } else if(/Android/i.test(userAgent)) {
      picSuffix = '.webp';
    }
  }

  // 此对象会合并然后传给服务端路由，不需要可不传
  const context = { picSuffix };

  renderer.renderToString(req, context).then(({ error, html }) => {
    if(error){
      if(error.url){
        res.redirect(error.url);
      } else if(error.code) {
        if(error.code === '404'){
          const notFoundPageHtml = fs.readFileSync('./templates/404.html', 'utf-8');
          res.status(404).send(notFoundPageHtml);
        } else {
          res.status(error.code).send('error code', error.code);
        }
      }
    } else {
      res.send(html)
    }

  }).catch((err)=>{
    const errorPageHtml = fs.readFileSync('./templates/500.html', 'utf-8');
    res.status(500).send(errorPageHtml);
  })
}

// 接收所有get请求
app.get('*', isProd ? render : (req, res) => {
  // 等待客户端和服务端打包完成后进行render
  readyPromise.then(() => {
    render(req, res);
  })
});

const port  = 3010;
app.listen(port, () => {
  console.log('app is running at port: ', port);
})

