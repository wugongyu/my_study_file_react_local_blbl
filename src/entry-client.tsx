// 客户端的webpack打包入口
/// <reference types='webpack-env' />
import * as React from "react"
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { legacy_createStore as createStore } from "redux";
import { loadableReady } from '@loadable/component';
import * as ReactDOM from "react-dom";

import Root from "./App";
import App from "./App";
const createApp = (Component) => {
  // 获取服务端初始化的state，创建store
  const initialState = (window as any).__INITIAL_STATE__;
  const store = createStore(initialState)
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Component />
      </BrowserRouter>
    </Provider>
  );
}

/**
 * hydrate --- 一般用于ssr（服务器端渲染），
 * hydrate的策略与render的策略不一样，其并不会对整个dom树做dom patch，
 * 其只会对text Content内容做patch，对于属性并不会做patch。
 * 
 * 所以用ssr服务器端渲染，一定要让服务器端塞给 React 组件的数据和浏览器端一致,
 * 为了达到这一目的，必须把传给 React 组件的数据给保留住，
 * 随着 HTML 一起传递给浏览器网页，这个过程，叫做“脱水”（Dehydrate）；
 * 在浏览器端，就直接拿这个“脱水”数据来初始化 React 组件，这个过程叫“注水”（Hydrate）。
 * */ 
// 加载组件
loadableReady().then(() => {
  ReactDOM.hydrate(createApp(App), document.getElementById('app'));
})

// 热更新
if(module.hot) {
  module.hot.accept('./App', () => {
    const NewApp = require('./App').default;
    ReactDOM.hydrate(createApp(NewApp), document.getElementById('app'));
  });
}