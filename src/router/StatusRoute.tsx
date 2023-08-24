import * as React from "react";
import { Route } from "react-router-dom";

interface StatusRouteProps {
  code: number;
  [key: string]: any;
}

const StatusRoute: React.FC<StatusRouteProps> = (props) => {
  return (
    <Route render={({ staticContext }) => {
      // 客户端无staticContext对象
      if(staticContext){
        // 设置状态码
        staticContext.statusCode = props.code
      }
      return props.children;
    }}></Route>
  )
}

export default StatusRoute;