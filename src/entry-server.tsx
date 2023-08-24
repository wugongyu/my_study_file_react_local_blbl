import * as React from "react";
import { Provider } from "react-redux";
import { StaticRouter } from "react-router-dom";
import createStore from "./redux/store";
import Root from "./App";
import router from "./router";

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