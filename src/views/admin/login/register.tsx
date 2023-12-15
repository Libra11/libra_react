/**
 * Author: Libra
 * Date: 2023-12-06 10:48:43
 * LastEditors: Libra
 * Description:
 */
import { IRegister, getCaptchaApi, registerApi } from "@/api/user";
import { Button, Col, Form, Input, Row, message, notification } from "antd";
import { NotificationPlacement } from "antd/es/notification/interface";

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

export const RegisterCom: React.FC = () => {
  const [form] = Form.useForm();
  const [messageApi] = message.useMessage();
  const [api, contextHolder] = notification.useNotification();

  const openNotification = (placement: NotificationPlacement, code: string) => {
    api.info({
      message: `模拟验证码如下：`,
      description: code,
      placement,
    });
  };

  const onFinish = async (values: IRegister) => {
    const res = await registerApi(values);
    if (res.code === 200) {
      messageApi.success("注册成功");
    } else {
      messageApi.error(res.message);
    }
  };

  const getCaptcha = async () => {
    const mobile = form.getFieldValue("mobile");
    const res = await getCaptchaApi({
      mobile,
    });
    console.log(res.code);
    if (res.code === 200) {
      openNotification("topLeft", res.data);
    } else {
      messageApi.error(res.message);
    }
  };

  return (
    <>
      {contextHolder}
      <Form
        {...formItemLayout}
        form={form}
        name="register"
        onFinish={onFinish}
        initialValues={{
          prefix: "86",
        }}
        style={{ maxWidth: 600 }}
        scrollToFirstError
      >
        <Form.Item
          name="email"
          label="邮箱"
          rules={[
            {
              type: "email",
              message: "请输入正确的邮箱地址!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="password"
          label="密码"
          rules={[
            {
              required: true,
              message: "请输入密码!",
            },
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="password2"
          label="确认密码"
          dependencies={["password"]}
          hasFeedback
          rules={[
            {
              required: true,
              message: "请确认密码!",
            },
            ({ getFieldValue }: { getFieldValue: any }) => ({
              validator(_: any, value: string) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("两次输入的密码不一致!"));
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="name"
          label="昵称"
          rules={[
            {
              required: true,
              message: "请输入昵称!",
              whitespace: true,
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="mobile"
          label="手机号"
          rules={[{ required: false, message: "请输入手机号码!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="验证码">
          <Row gutter={8}>
            <Col span={12}>
              <Form.Item
                name="captcha"
                noStyle
                rules={[
                  {
                    required: true,
                    message: "请输入验证码!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Button onClick={getCaptcha}>获取验证码</Button>
            </Col>
          </Row>
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            注册
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};
