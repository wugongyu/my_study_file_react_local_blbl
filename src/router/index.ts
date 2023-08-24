import loadable from "@loadable/component";
import * as React from "react";
import NestedRoute from "./NestedRoute";
import StatusRoute from "./StatusRoute";

export interface RouteProps {
  path: string;
  component: any;
  asyncData?: unknown;
  exact?: boolean;
  routes?: RouteProps[];
}

const router: RouteProps[] = [
  {
    path: '/index',
    component: loadable(() => import('../containers/Home')),
    asyncData: (store) => {
      return {};
    }
  }
];

export default router;

export {
  NestedRoute,
  StatusRoute,
}