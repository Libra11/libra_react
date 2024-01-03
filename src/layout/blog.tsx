/**
 * Author: Libra
 * Date: 2024-01-03 10:44:49
 * LastEditors: Libra
 * Description:
 */
import { Layout } from "antd";
import { Outlet } from "react-router-dom";

export const BlogLayout: React.FC = () => {
  return (
    <Layout className="w-full h-full flex flex-col">
      <header>header</header>
      <div className=" flex-1">
        <Outlet />
      </div>
      <footer>footer</footer>
    </Layout>
  );
};
