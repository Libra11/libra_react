/**
 * Author: Libra
 * Date: 2024-01-03 17:06:24
 * LastEditors: Libra
 * Description:
 */
import { blogInfo, getAllTagsApi, getBlogsApi } from "@/api/blog";
import { BlogItem } from "@/components/BlogItem";
import { TagCom } from "@/components/Tag";
import { Pagination } from "antd";
import { useEffect, useState } from "react";

export const BlogTagView: React.FC = () => {
  const [dataSource, setDataSource] = useState<blogInfo[]>([]);
  const [paginationProps, setPaginationProps] = useState({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [tag, setTag] = useState<
    {
      id: number;
      name: string;
    }[]
  >([]);

  const getBlogsListByTag = async (
    page: number,
    pageSize: number,
    tagId: number
  ) => {
    const res = await getBlogsApi({
      page,
      pageSize,
      title: "",
      tagId,
      categoryId: 0,
    });
    if (res.code === 200) {
      const blogs = res.data.blogs.map((blog, index) => ({
        ...blog,
        key: index,
      }));
      setDataSource(blogs);
      const pp = {
        showSizeChanger: true,
        showQuickJumper: false,
        showTotal: () => `共${res.data.total}条`,
        pageSize,
        current: page,
        pageSizeOptions: ["8", "20", "30", "40"],
        total: res.data.total,
        onShowSizeChange: async (current: number, ps: number) => {
          await getBlogsListByTag(current, ps, tagId);
          setPage(current);
          setPageSize(ps);
        },
        onChange: (current: number) => {
          if (current === page) return;
          getBlogsListByTag(current, pageSize, tagId);
          setPage(current);
        },
      };
      setPaginationProps(pp);
    }
  };
  const getTag = async () => {
    const res = await getAllTagsApi();
    if (res.code === 200) {
      const tag = res.data.tags.map((item) => ({
        name: item.name,
        id: item.id,
      }));
      setTag(tag);
      getBlogsListByTag(page, pageSize, tag[0].id);
    }
  };

  const getTagById = (id: number) => async () => {
    await getBlogsListByTag(page, pageSize, id);
  };

  useEffect(() => {
    getTag();
  }, []);
  return (
    <div className=" w-[1280px] m-auto flex items-start justify-start">
      <div className=" flex-1">
        <div className="text-[var(--main-color)] text-[2rem] font-bold mt-8">
          Result
        </div>
        <div className="mt-4 flex-1 flex flex-wrap items-center justify-start">
          {dataSource.map((blog, idx) => (
            <BlogItem key={idx} blog={blog} />
          ))}
        </div>
        <Pagination className="mt-4 text-right" {...paginationProps} />
      </div>
      <div className=" w-[280px] border border-[var(--card-border)] rounded-[20px] hover:shadow-lg font-bold sticky top-[120px] left-2 ml-8 p-4 flex justify-start items-start flex-wrap">
        {tag.map((item) => (
          <div
            className="cursor-pointer flex mb-1"
            onClick={getTagById(item.id)}
            key={item.id}
          >
            <TagCom key={item.id} tag={item} />
            <div className=" w-1"></div>
          </div>
        ))}
      </div>
    </div>
  );
};
