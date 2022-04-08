import React, { useState } from "react";

import "./styles/App.css";
import "./styles/index.css";
import "antd/dist/antd.css";

import { Layout } from "antd";
import { useThemeSwitcher } from "react-css-theme-switcher";
import useMediaQuery from "./hooks/useMediaQuery";

import Infos from "./Pages/Infos/Infos";
import RPOptimizer from "./Pages/RPOptimizer/RPOptimizer";

import NavBar from "./Components/NavBar";
import SideBar from "./Components/SideBar";
import SideMenu from "./Components/SideMenu";

const { Content, Footer } = Layout;

const App = () => {
  const [sideMenuKey, setSideMenuKey] = useState(1);
  const { currentTheme } = useThemeSwitcher();

  // this is stupid, but I am bored with this css shit.
  const margin = useMediaQuery("(max-width: 991.9px)", 0, 200);

  const MyMenu = <SideMenu setSideMenuKey={setSideMenuKey} />;

  return (
    <>
      <NavBar menu={MyMenu} />
      <Layout style={{ minHeight: "100vh" }}>
        <SideBar menu={MyMenu} />
        <Layout style={{ marginLeft: margin }}>
          <Content style={{ margin: "24px 16px 0" }}>
            <div
              className="site-layout-background"
              style={{
                padding: 24,
                minHeight: 360,
                backgroundColor: currentTheme === "dark" ? "#121212" : "white",
              }}
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
