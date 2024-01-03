import { blogInfo, getBlogsApi } from "@/api/blog";
import { BlogItem } from "@/components/BlogItem";
import { Pagination } from "antd";
import { useEffect, useState } from "react";

/**
 * Author: Libra
 * Date: 2024-01-03 10:21:14
 * LastEditors: Libra
 * Description:
 */
export const BlogRecentView: React.FC = () => {
  const [dataSource, setDataSource] = useState<blogInfo[]>([]);
  const [paginationProps, setPaginationProps] = useState({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const getBlogList = async (page: number, pageSize: number) => {
    const res = await getBlogsApi({
      page,
      pageSize,
      title: "",
      tagId: 0,
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
        pageSizeOptions: ["10", "20", "30", "40"],
        total: res.data.total,
        onShowSizeChange: async (current: number, ps: number) => {
          await getBlogList(current, ps);
          setPage(current);
          setPageSize(ps);
        },
        onChange: (current: number) => {
          if (current === page) return;
          getBlogList(current, pageSize);
          setPage(current);
        },
      };
      setPaginationProps(pp);
    }
  };

  useEffect(() => {
    getBlogList(page, pageSize);
  }, []);

  return (
    dataSource.length > 0 && (
      <div className="w-full">
        <div className="text-center text-2xl font-bold">最近文章</div>
        <div className="mt-4">
          {dataSource.map((item) => (
            <BlogItem
              title={item.title}
              author={item.author}
              imgUrl={item.imgUrl}
              createAt={item.createAt}
              updateAt={item.updateAt}
              category={item.category}
              desc={item.desc}
              key={item.id}
              id={item.id}
            />
          ))}
        </div>
        <Pagination {...paginationProps} />
      </div>
    )
  );
};
