import * as React from "react";
import { Provider } from "react-redux";
import { StaticRouter } from "react-router-dom";
import createStore from "./redux/store";
import Root from "./App";
import router from "./router";
/**
 * 利用context
 * 在服务端将预取的数据注入到浏览器【数据注水】，
 * 使浏览器端可以访问到，客户端进行渲染前将数据传入对应的组件即可【数据脱水】
*/
const createApp = (context, url, store) => {
  const NewApp: React.FC<{}> = () => {
    return (
      <Provider store={store}>
        <StaticRouter context={context} location={url}>
          <Root/>
        </StaticRouter>
      </Provider>
    )
  }
  return <NewApp />
}

export {
  createApp,
  router,
  createStore
}