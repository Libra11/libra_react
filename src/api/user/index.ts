/*
 * @Author: Libra
 * @Date: 2023-12-05 17:54:10
 * @LastEditors: Libra
 * @Description: user api
 */
import fetch, { type ResponseData } from "@/request";

type ILogin = {
  username: string;
  password: string;
};

function loginApi(data: ILogin): Promise<ResponseData<string>> {
  return fetch<string>(`client/login`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export { loginApi };
