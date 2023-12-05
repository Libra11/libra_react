/*
 * @Author: Libra
 * @Date: 2023-03-22 10:31:03
 * @LastEditTime: 2023-12-05 17:53:29
 * @LastEditors: Libra
 * @Description: fetch 封装
 */
import { config } from "@/api/config";
import { handleCode } from "./code";
import { store } from "@/store";

export type ResponseData<T> = {
  code: number;
  data: T;
  message: string;
};

export interface RequestOptions extends Partial<RequestInit> {
  formData?: FormData;
}

export function getOptions(options?: RequestOptions): RequestInit {
  const { token } = store.getState().user;
  const headers: Record<string, string> = {
    Authorization: token ? `Bearer ${token}` : "",
  };
  if (options?.formData) {
    options.body = options.formData;
  } else {
    headers["Content-Type"] = "application/json";
  }
  // 设置默认值
  const defaultOptions: RequestInit = {
    method: "GET",
    headers,
  };
  return { ...defaultOptions, ...options };
}

export default async <T>(
  url: string,
  option?: RequestInit,
  service: string = config.EXAM
): Promise<ResponseData<T>> => {
  const newOption = getOptions(option);
  const newUrl = service + url;
  try {
    const response = await fetch(newUrl, newOption);
    const res = await response.json();
    if (res.code) handleCode(res);
    return res;
  } catch (error) {
    return Promise.reject(error);
  }
};
