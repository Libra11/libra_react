/*
 * @Author: Libra
 * @Date: 2023-03-22 15:47:47
 * @LastEditTime: 2023-12-07 18:12:13
 * @LastEditors: Libra
 * @Description: 返回码处理
 */
import { message } from "antd";
import { ResponseData } from ".";

const code = {
  // 登录失败
  LOGIN_FAIL: 1005,
};

export function handleCode(res: ResponseData<string>) {
  switch (res.code) {
    case code.LOGIN_FAIL:
      // 登录失败
      message.error("登录失败");
      break;
    default:
      message.error(res.message);
      break;
  }
}
