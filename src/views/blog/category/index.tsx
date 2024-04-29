/**
 * Author: Libra
 * Date: 2024-01-03 17:06:24
 * LastEditors: Libra
 * Description:
 */
import { blogInfo, getAllCategoryApi, getBlogsApi } from "@/api/blog";
import { BlogItem } from "@/components/BlogItem";
import { BlogItemMobile } from "@/components/BlogItemMobile";
import { TagCom } from "@/components/Tag";
import { Pagination } from "antd";
import { useEffect, useState } from "react";

export const BlogCategoryView: React.FC = () => {
  const [dataSource, setDataSource] = useState<blogInfo[]>([]);
  const [paginationProps, setPaginationProps] = useState({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [category, setCategory] = useState<
    {
      id: number;
      name: string;
    }[]
  >([]);

  const getBlogsListByCategory = async (
    page: number,
    pageSize: number,
    categoryId: number
  ) => {
    const res = await getBlogsApi({
      page,
      pageSize,
      title: "",
      tagId: 0,
      categoryId,
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
          await getBlogsListByCategory(current, ps, categoryId);
          setPage(current);
          setPageSize(ps);
        },
        onChange: (current: number) => {
          if (current === page) return;
          getBlogsListByCategory(current, pageSize, categoryId);
          setPage(current);
        },
      };
      setPaginationProps(pp);
    }
  };
  const getCategory = async () => {
    const res = await getAllCategoryApi();
    if (res.code === 200) {
      const category = res.data.category.map((item) => ({
        name: item.name,
        id: item.id,
      }));
      setCategory(category);
      getBlogsListByCategory(page, pageSize, category[0].id);
    }
  };

  const getCategoryById = (id: number) => async () => {
    await getBlogsListByCategory(page, pageSize, id);
  };

  useEffect(() => {
    getCategory();
  }, []);
  return (
    <div className=" w-full md:w-[1280px] m-auto flex items-start justify-start">
      <div className=" flex-1">
        <div className="md:hidden p-2">
          <div className=" w-full border border-[var(--card-border)] rounded-[10px] hover:shadow-lg font-bold sticky top-[120px] left-2 p-4 flex justify-start items-start">
            {category.map((item) => (
              <div
                className="cursor-pointer flex mb-1"
                onClick={getCategoryById(item.id)}
                key={item.id}
              >
                <TagCom key={item.id} tag={item} />
                <div className=" w-1"></div>
              </div>
            ))}
          </div>
        </div>
        <div className="ml-2 md:ml-0 text-[var(--main-color)] text-[2rem] font-bold mt-8">
          Result
        </div>
        <div className="hidden md:block">
          <div className="mt-4 flex-1 flex flex-wrap items-center justify-start">
            {dataSource.map((blog, idx) => (
              <BlogItem key={idx} blog={blog} />
            ))}
          </div>
        </div>
        <div className="md:hidden">
          <div className="mt-4 flex-1 flex flex-wrap items-center justify-start">
            {dataSource.map((blog, idx) => (
              <BlogItemMobile key={idx} blog={blog} />
            ))}
          </div>
        </div>
        <Pagination className="mt-4 text-right" {...paginationProps} />
      </div>
      <div className="hidden md:block">
        <div className=" w-[280px] border border-[var(--card-border)] rounded-[20px] hover:shadow-lg font-bold sticky top-[120px] left-2 ml-8 p-4 flex justify-start items-start">
          {category.map((item) => (
            <div
              className="cursor-pointer flex mb-1"
              onClick={getCategoryById(item.id)}
              key={item.id}
            >
              <TagCom key={item.id} tag={item} />
              <div className=" w-1"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
