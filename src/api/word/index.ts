/*
 * @Author: Libra
 * @Date: 2024-01-03 17:09:58
 * @LastEditors: Libra
 * @Description:
 */
import fetch, { type ResponseData } from "@/request";

export type IWord = {
  word: string;
  definition: string;
  example: string;
  phrase: string;
  phonetic: string;
  createAt: number;
  updateAt: number;
};
function addWordApi(data: { word: IWord }): Promise<ResponseData<string>> {
  return fetch<string>(`blog/addWord`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

function deleteWordApi(data: { id: number }): Promise<ResponseData<string>> {
  return fetch<string>(`blog/deleteWord`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export type GetWordsRequest = {
  page: number;
  pageSize: number;
};

export type wordInfo = {
  id: number;
  word: string;
};

export type GetWordsResponse = {
  total: number;
  words: wordInfo[];
};
function getWordsApi(
  data: GetWordsRequest
): Promise<ResponseData<GetWordsResponse>> {
  return fetch<GetWordsResponse>(`blog/getWords`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

function getWordByIdApi(data: {
  id: number;
}): Promise<ResponseData<{ word: IWord }>> {
  return fetch<{ word: IWord }>(`blog/getWordById?id=${data.id}`);
}

export { addWordApi, deleteWordApi, getWordsApi, getWordByIdApi };
