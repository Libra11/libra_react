/**
 * Author: Libra
 * Date: 2023-12-05 18:36:11
 * LastEditors: Libra
 * Description:
 */
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Button, theme, MenuProps } from "antd";
import { useEffect, useState } from "react";
import SvgIcon from "@/components/Svg";

const { Header, Sider, Content } = Layout;

export const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [currentSelect, setCurrentSelect] = useState("");
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    setCurrentSelect(path);
  }, [currentSelect]);

  const handleMenuClick = (e: any) => {
    setCurrentSelect(e.key);
  };

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const items: MenuProps["items"] = [
    {
      key: "/admin/home",
      icon: <UserOutlined />,
      label: <Link to="/admin">主页</Link>,
    },
    {
      key: "/admin/blog",
      icon: <VideoCameraOutlined />,
      label: <Link to="/admin/blog">博客</Link>,
      children: [
        {
          key: "/admin/blog/list",
          label: <Link to="/admin/blog">博客管理</Link>,
        },
        {
          key: "/admin/blog/add",
          label: <Link to="/admin/blog/add">添加博客</Link>,
        },
        {
          key: "/admin/blog/tc",
          label: <Link to="/admin/blog/tc">标签分类</Link>,
        },
      ],
    },
    {
      key: "/admin/word",
      icon: <VideoCameraOutlined />,
      label: <Link to="/admin/word">单词</Link>,
      children: [
        {
          key: "/admin/word/list",
          label: <Link to="/admin/word">单词管理</Link>,
        },
      ],
    },
  ];

  return (
    <Layout className=" w-full h-full">
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className=" flex justify-center items-center h-12">
          <SvgIcon name="logo_dark" size={24} />
          <span className=" ml-1 text-white text-xl font-bold">Libra</span>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[currentSelect]}
          onClick={handleMenuClick}
          items={items}
        ></Menu>
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: "calc(100vh - 112px)",
            background: colorBgContainer,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
