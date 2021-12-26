import React, { useState } from "react";

import "./App.css";
import "./index.css";
import "antd/dist/antd.css";

import { Layout, Menu } from "antd";
import { ExperimentOutlined, InfoCircleOutlined } from "@ant-design/icons";
import AppLogo from "./Components/AppLogo";
import Infos from "./Pages/Infos";
import RPOptimizer from "./Pages/RPOptimizer";

const { Header, Content, Footer, Sider } = Layout;

const App = () => {
  const [sideMenuKey, setSideMenuKey] = useState(1);

  return (
    <>
      <Layout style={{ minHeight: "100vh" }}>
        <Sider breakpoint="lg" collapsedWidth="0">
          <AppLogo />
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={["1"]}
            onSelect={(selection) => {
              setSideMenuKey(parseInt(selection.key, 10));
            }}
          >
            <Menu.Item key="1" icon={<ExperimentOutlined />}>
              RP Optimizer
            </Menu.Item>
            <Menu.Item key="2" icon={<InfoCircleOutlined />}>
              Infos
            </Menu.Item>
          </Menu>
        </Sider>

        <Layout>
          <Header
            className="site-layout-sub-header-background"
            style={{ padding: 0 }}
          />

          <Content style={{ margin: "24px 16px 0" }}>
            <div
              className="site-layout-background"
              style={{ padding: 24, minHeight: 360 }}
            >
              {sideMenuKey === 1 ? (
                <RPOptimizer />
              ) : sideMenuKey === 2 ? (
                <Infos />
              ) : null}
            </div>
          </Content>

          <Footer style={{ textAlign: "center" }}>
            RP optimizer {new Date().getFullYear()} Created by Anis Snoussi &
            Walid Snoussi <br />
            Version Ref :{" "}
            {process.env.REACT_APP_VERCEL_GIT_COMMIT_SHA
              ? process.env.REACT_APP_VERCEL_GIT_COMMIT_SHA.substring(0, 8)
              : "no-ref"}
          </Footer>
        </Layout>
      </Layout>
    </>
  );
};

export default App;
