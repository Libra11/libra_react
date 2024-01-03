/*
 * @Author: Libra
 * @Date: 2023-03-22 15:47:47
 * @LastEditTime: 2023-12-28 14:15:05
 * @LastEditors: Libra
 * @Description: 返回码处理
 */
import { message } from "antd";
import { ResponseData } from ".";

const code = {
  // 登录失败
  NOT_LOGIN: 4009,
};

export function handleCode(res: ResponseData<string>) {
  switch (res.code) {
    case code.NOT_LOGIN:
      window.location.href = "/login";
      break;
    default:
      message.error(res.message);
      break;
  }
}
