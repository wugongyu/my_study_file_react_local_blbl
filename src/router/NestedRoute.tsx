import * as React from "react";
import { Route } from "react-router-dom";
import { RouteProps } from ".";

const NestedRoute: React.FC<RouteProps> = (route) => {
  return (
    <Route
      path={route.path}
      exact={route.exact}
      /* 渲染路由对应的视图组件，将路由组件的props传递给视图组件 */
      render={(props) => <route.component {...props} router={route.routes}></route.component>}
    ></Route>
  )
}

export default NestedRoute;