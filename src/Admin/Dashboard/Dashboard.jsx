import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../Context/StoreContext";
import "./Dashboard.css";
import {
  DesktopOutlined,
  FileOutlined,
  TeamOutlined,
  PieChartOutlined,
  AppstoreAddOutlined,
  RetweetOutlined,
  WechatOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";
import { Link, Outlet } from "react-router-dom";
import Navbar from "../Components/Navbar/Navbar";

const { Content, Sider } = Layout;

function getItem(label, key, icon, items) {
  return {
    key,
    icon,
    items,
    label,
  };
}

const items = [
  getItem("Option", "option", <PieChartOutlined />),
  getItem("Add", "add", <DesktopOutlined />),
  getItem("Orders", "orders", <TeamOutlined />),
  getItem("List", "list", <FileOutlined />),
  getItem("Add Category", "add-category", <AppstoreAddOutlined />),
  getItem("Review", "review", <RetweetOutlined />),
  getItem("Superchat", "superchat", <WechatOutlined />),
];

const Dashboard = () => {
  const { setHeaderShow } = useContext(StoreContext);

  const [collapsed, setCollapsed] = useState(false);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    setHeaderShow(false);
  }, [setHeaderShow]);

  return (
    <>
      <Navbar />
      <Layout style={{ minHeight: "100vh" }}>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
        >
          <div className="demo-logo-vertical" />
          <Menu theme="dark" mode="inline">
            {items.map((item) => (
              <Menu.Item key={item.key}>
                <Link to={item.key}>
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </Menu.Item>
            ))}
          </Menu>
        </Sider>
        <Layout>
          <Content style={{ margin: "0 16px" }}>
            <div
              style={{
                padding: 24,
                minHeight: 360,
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
              }}
            >
              <Outlet />
            </div>
          </Content>
        </Layout>
      </Layout>
    </>
  );
};

export default Dashboard;
