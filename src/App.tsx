import * as React from 'react';
// React Helmet是一个HTML文档head管理工具，管理对文档头的所有更改
import Helmet from 'react-helmet';
import { Redirect, Switch } from 'react-router-dom';
import Context, { context } from './context';
import router, { NestedRoute, StatusRoute } from './router';

const App: React.FC<{}> = () => {
  return (
    <Context.Provider value={context}>
      <div className="view">
        <Helmet>
            <title>( ゜- ゜)つロ~</title>
            <meta name='title' content='reactBLBL---( ゜- ゜)つロ~' />
            <meta name='keywords' content='react,ssr' />
            <meta name='description' content='mockBLBL'/>
        </Helmet>
        <Switch>
          {/* route match */}
          {router.map((route, index) => (
            <NestedRoute {...route} key={index}></NestedRoute>
          ))}
          {/* default match --- 默认跳转至首页 */}
          <Redirect from='/' to='/index' />
          {/* 未匹配上路由，展示404页面 */}
          <StatusRoute code={404}>
            <div>
              <h1>Not Found</h1>
            </div>
          </StatusRoute>
        </Switch>
      </div>
    </Context.Provider>
  );
};

export default App;