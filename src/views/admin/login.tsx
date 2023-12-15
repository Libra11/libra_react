/**
 * Author: Libra
 * Date: 2023-12-05 13:44:18
 * LastEditors: Libra
 * Description:
 */

import { Tabs, TabsProps } from "antd";
import { LoginCom } from "./login/login";
import { RegisterCom } from "./login/register";

const items: TabsProps["items"] = [
  {
    key: "1",
    label: "登录",
    children: <LoginCom />,
  },
  {
    key: "2",
    label: "注册",
    children: <RegisterCom />,
  },
];
export const LoginView: React.FC = () => (
  <Tabs defaultActiveKey="1" items={items} />
);

export default LoginView;
