import React from "react";
import { Menu } from "antd";
import { ExperimentOutlined, InfoCircleOutlined } from "@ant-design/icons";

const SideMenu = ({ setSideMenuKey }) => {
  return (
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
  );
};
export default SideMenu;
