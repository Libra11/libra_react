/**
 * Author: Libra
 * Date: 2023-12-06 10:06:46
 * LastEditors: Libra
 * Description:
 */
import { Layout } from "antd";
import { Outlet } from "react-router-dom";

export const BlankLayout: React.FC = () => {
  return (
    <Layout className="w-full h-full">
      <Outlet />
    </Layout>
  );
};
