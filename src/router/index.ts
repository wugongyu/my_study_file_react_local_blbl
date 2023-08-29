import loadable from "@loadable/component";
import * as React from "react";
import getAsyncIndexContent from "../redux/async-actions/home";
import NestedRoute from "./NestedRoute";
import StatusRoute from "./StatusRoute";

export interface RouteProps {
  path: string;
  component: any;
  asyncData?: unknown;
  exact?: boolean;
  routes?: RouteProps[];
}
// 供双端使用的路由配置（实现【路由同构】）
const router: RouteProps[] = [
  {
    path: '/index',
    // loadable--按需加载组件
    component: loadable(() => import('../containers/Home')),
    // 定义asyncData，把数据请求方法关联到路由中，
    // 从而实现【数据预取同构】，解决双端如何使用同一套数据请求方法来进行数据请求的问题
    asyncData: (store) => {
      return store.dispatch(getAsyncIndexContent());
    }
  }
];

export default router;

export {
  NestedRoute,
  StatusRoute,
}