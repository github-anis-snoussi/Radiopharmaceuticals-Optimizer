import React, { useState } from 'react';
// styles
import './styles/App.css';
import './styles/index.css';
import 'antd/dist/antd.min.css';
// utils
import { useThemeSwitcher } from 'react-css-theme-switcher';
import useMediaQuery from './hooks/useMediaQuery';
// components
import { Layout } from 'antd';
import { NavBar, SideBar, SideMenu } from './Components';
// pages
import { RPOptimizer, Infos } from './Pages';

const { Content, Footer } = Layout;

const App = () => {
  const [sideMenuKey, setSideMenuKey] = useState(1);
  const { currentTheme } = useThemeSwitcher();
  const margin = useMediaQuery('(max-width: 991.9px)', 0, 200);

  const MyMenu = <SideMenu setSideMenuKey={setSideMenuKey} />;

  return (
    <>
      <NavBar menu={MyMenu} />
      <Layout style={{ minHeight: '100vh' }}>
        <SideBar menu={MyMenu} />
        <Layout style={{ marginLeft: margin }}>
          <Content style={{ margin: '24px 16px 0' }}>
            <div
              className="site-layout-background"
              style={{
                padding: 24,
                minHeight: 360,
                backgroundColor: currentTheme === 'dark' ? '#121212' : 'white',
              }}
            >
              {sideMenuKey === 1 ? <RPOptimizer /> : sideMenuKey === 2 ? <Infos /> : null}
            </div>
          </Content>

          <Footer style={{ textAlign: 'center' }}>
            RP optimizer {new Date().getFullYear()} Created by Anis Snoussi & Walid Snoussi <br />
            Version Ref :{' '}
            {process.env.REACT_APP_VERCEL_GIT_COMMIT_SHA
              ? process.env.REACT_APP_VERCEL_GIT_COMMIT_SHA.substring(0, 8)
              : 'no-ref'}
          </Footer>
        </Layout>
      </Layout>
    </>
  );
};

export default App;
