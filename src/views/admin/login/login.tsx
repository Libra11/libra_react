/**
 * Author: Libra
 * Date: 2023-12-06 10:48:37
 * LastEditors: Libra
 * Description:
 */
import { Button, Form, Input, message } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { ILogin, loginApi } from "@/api/user";
import { useNavigate } from "react-router-dom";
import { setToken } from "@/store/user";
import { useDispatch } from "react-redux";

export const LoginCom: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [messageApi] = message.useMessage();
  const onFinish = async (values: ILogin) => {
    const res = await loginApi(values);
    if (res.code === 200) {
      messageApi.success("登录成功");
      navigate("/admin");
      const { accessToken, tokenType } = res.data;
      dispatch(setToken(`${tokenType} ${accessToken}`));
    }
  };
  return (
    <div>
      <h2 className=" text-center">登录</h2>
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Form.Item
          name="name"
          rules={[{ required: true, message: "请输入用户名！" }]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="请输入用户名"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "请输入密码!" }]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="请输入密码"
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button w-full"
          >
            登录
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
