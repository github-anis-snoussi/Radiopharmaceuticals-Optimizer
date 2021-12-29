import React from "react";
import { Layout } from "antd";
import AppLogo from "./AppLogo";

const SideBar = ({ menu }) => {
  return (
    <Layout.Sider
      className="sidebar"
      breakpoint={"lg"}
      theme="dark"
      collapsedWidth={0}
      trigger={null}
      style={{ height: document.documentElement.scrollHeight }}
    >
      <AppLogo />
      {menu}
    </Layout.Sider>
  );
};
export default SideBar;
