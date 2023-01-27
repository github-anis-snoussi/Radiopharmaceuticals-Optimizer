import React from "react";
import { Layout } from "antd";
import AppLogo from "./AppLogo";

const SideBar = ({ menu }: { menu: any }) => {
  return (
    <Layout.Sider
      className="sidebar"
      breakpoint={"lg"}
      theme="dark"
      collapsedWidth={0}
      trigger={null}
      style={{ height: "100vh", position: "fixed", width: 200 }}
    >
      <AppLogo />
      {menu}
    </Layout.Sider>
  );
};
export default SideBar;
