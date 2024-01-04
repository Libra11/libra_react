import { getWordsApi, wordInfo } from "@/api/word";
import { Pagination } from "antd";
import { useEffect, useState } from "react";

/**
 * Author: Libra
 * Date: 2024-01-03 17:06:42
 * LastEditors: Libra
 * Description:
 */
export const BlogWordView: React.FC = () => {
  const [words, setWords] = useState<wordInfo[]>([]); // [{}, {}
  const [paginationProps, setPaginationProps] = useState({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const getWords = async (page: number, pageSize: number) => {
    const res = await getWordsApi({
      page,
      pageSize,
    });
    if (res.code === 200) {
      setWords(res.data.words);
      const pp = {
        showSizeChanger: true,
        showQuickJumper: false,
        showTotal: () => `共${res.data.total}条`,
        pageSize,
        current: page,
        pageSizeOptions: ["10", "20", "30", "40"],
        total: res.data.total,
        onShowSizeChange: async (current: number, ps: number) => {
          await getWords(current, ps);
          setPage(current);
          setPageSize(ps);
        },
        onChange: (current: number) => {
          if (current === page) return;
          getWords(current, pageSize);
          setPage(current);
        },
      };
      setPaginationProps(pp);
    }
  };

  useEffect(() => {
    getWords(page, pageSize);
  }, []);
  return (
    <div>
      {words.map((word, index) => {
        return (
          <div
            className=" p-2 bg-slate-200 rounded cursor-pointer inline-block"
            key={index}
          >
            {word.word}
          </div>
        );
      })}
      <Pagination {...paginationProps} />
    </div>
  );
};
