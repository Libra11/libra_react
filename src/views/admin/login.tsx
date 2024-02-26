/**
 * Author: Libra
 * Date: 2023-12-05 13:44:18
 * LastEditors: Libra
 * Description:
 */

import { Card } from "antd";
import { LoginCom } from "./login/login";

export const LoginView: React.FC = () => (
  <div className=" w-screen h-screen flex justify-center items-center">
    <Card className=" w-[300px] h-[300px] rounded-lg flex justify-center items-center">
      <LoginCom />
    </Card>
  </div>
);

export default LoginView;
