/*
 * @Author: Libra
 * @Date: 2023-12-19 14:55:26
 * @LastEditors: Libra
 * @Description:
 */
import fetch, { type ResponseData } from "@/request";

export type ITagsResult = {
  tags: {
    id: number;
    name: string;
  }[];
};
function getAllTagsApi(): Promise<ResponseData<ITagsResult>> {
  return fetch<ITagsResult>(`blog/getAllTags`);
}

export type ICategoryResult = {
  category: {
    id: number;
    name: string;
  }[];
};
function getAllCategoryApi(): Promise<ResponseData<ICategoryResult>> {
  return fetch<ICategoryResult>(`blog/getAllCategory`);
}

function deleteTagApi(data: { id: number }): Promise<ResponseData<string>> {
  return fetch<string>(`blog/deleteTag`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

function deleteCategoryApi(data: {
  id: number;
}): Promise<ResponseData<string>> {
  return fetch<string>(`blog/deleteCategory`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export type ITag = {
  tag: {
    name: string;
  };
};

function addTagApi(data: ITag): Promise<ResponseData<string>> {
  return fetch<string>(`blog/addTag`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export type ICategory = {
  category: {
    name: string;
  };
};

function addCategoryApi(data: ICategory): Promise<ResponseData<string>> {
  return fetch<string>(`blog/addCategory`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export type IToken = {
  accessId: string;
  policy: string;
  signature: string;
  expire: string;
  dir: string;
  host: string;
  securityToken: string;
  accessKeySecret: string;
  expiration: string;
};
function getOssTokenApi(): Promise<ResponseData<IToken>> {
  return fetch<IToken>(`blog/getOssToken`);
}

export interface IBlog {
  blog: {
    title: string;
    author: string;
    content: string;
    audioFile: string;
    createAt: number;
    updateAt: number;
    imgUrl: string;
    desc: string;
    category: {
      id: number;
      name: string;
    }[];
    tags: {
      id: number;
      name: string;
    }[];
  };
}
function addBlogApi(data: IBlog): Promise<ResponseData<string>> {
  return fetch<string>(`blog/addBlog`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export {
  getAllTagsApi,
  getAllCategoryApi,
  deleteTagApi,
  deleteCategoryApi,
  addTagApi,
  addCategoryApi,
  addBlogApi,
  getOssTokenApi,
};
