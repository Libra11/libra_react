/*
 * @Author: Libra
 * @Date: 2023-12-05 17:54:10
 * @LastEditors: Libra
 * @Description: user api
 */
import fetch, { type ResponseData } from "@/request";

export type ILogin = {
  username: string;
  password: string;
};

export type ILoginResult = {
  accessToken: string;
  accessTokenExp: number;
  refreshToken: string;
  tokenType: string;
};

function loginApi(data: ILogin): Promise<ResponseData<ILoginResult>> {
  return fetch<ILoginResult>(`user/login`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export type IRegister = {
  name: string;
  password: string;
  password2: string;
  mobile: string;
  email: string;
};

function registerApi(data: IRegister): Promise<ResponseData<string>> {
  return fetch<string>(`user/register`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

function getCaptchaApi(data: {
  mobile: string;
}): Promise<ResponseData<string>> {
  return fetch<string>(`user/getCaptcha`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export interface IUser {
  id: number;
  name: string;
  mobile: string;
  realname: string;
  account: string;
  status: number;
  lastLoginTime: number;
  address: string;
  province: number;
  city: number;
  area: number;
  email: string;
}
function getUserInfoApi(): Promise<ResponseData<IUser>> {
  return fetch<IUser>(`user/getUserInfo`);
}

export { loginApi, registerApi, getCaptchaApi, getUserInfoApi };
