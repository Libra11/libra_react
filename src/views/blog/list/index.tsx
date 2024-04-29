import { blogInfo, getBlogsApi } from "@/api/blog";
import { BlogItem } from "@/components/BlogItem";
import { BlogItemMobile } from "@/components/BlogItemMobile";
import SvgIcon from "@/components/Svg";
import { TagCom } from "@/components/Tag";
import { formatTimestamp } from "@/utils";
import { Pagination } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import avatar from "@/assets/images/avatar.jpg";

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
  const [pageSize, setPageSize] = useState(8);
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
        pageSizeOptions: ["8", "20", "30", "40"],
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

  const navigate = useNavigate();
  const goDetail = (id: number) => {
    navigate(`/blog/detail/${id}`);
  };

  useEffect(() => {
    getBlogList(page, pageSize);
  }, []);

  return (
    dataSource.length > 0 && (
      <div className="w-full md:w-[1280px] h-full m-auto flex justify-center items-start pb-8">
        <div className="w-[940px] md:pl-5 md:pr-10 h-full overflow-auto">
          <div className="hidden md:block">
            <div
              className="animate__animated animate__backInDown transition-all w-full h-[250px] rounded-[20px] border border-[var(--card-border)] flex items-center justify-center cursor-pointer overflow-hidden"
              onClick={() => goDetail(dataSource[0].id)}
            >
              <img
                className=" h-full w-[280px] object-cover"
                src={`${dataSource[0].imgUrl}`}
                alt=""
              />
              <div className="pl-5 pr-20 py-5 flex-1 flex flex-col items-start justify-center">
                <div className="">
                  {dataSource[0].category.map((item: any) => (
                    <TagCom key={item.id} tag={item} />
                  ))}
                </div>
                <div className=" text-2xl font-bold mt-2 text-[var(--main-color)] overflow-ellipsis line-clamp-2">
                  {dataSource[0].title}
                </div>
                <div className=" text-sm mt-4 text-[var(--text-color1)] overflow-hidden overflow-ellipsis line-clamp-2">
                  {dataSource[0].desc}
                </div>
                <div className="mt-4 flex items-center justify-between w-full text-[var(--text-color1)]">
                  <div className="flex items-center justify-center">
                    <SvgIcon
                      name="time"
                      size={24}
                      color="text-[var(--text-color1)]"
                    />
                    <div className="ml-1">
                      {formatTimestamp(dataSource[0].createAt)}
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <SvgIcon
                      name="update"
                      size={24}
                      color="text-[var(--text-color1)]"
                    />
                    <div className="ml-1">
                      {formatTimestamp(dataSource[0].updateAt)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="md:mt-12 ml-2 md:ml-0 text-2xl font-bold text-[var(--main-color)]">
            Recently
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
        <div className="hidden md:block animate__animated animate__backInRight mt-14 w-[280px] h-[260px] bg-[var(--bg-color)] rounded-[20px] cursor-pointer relative border border-[var(--card-border)]">
          <img
            className="absolute w-[100px] h-[100px] -top-[50px] left-[90px] border-2 border-[var(--primary-color)] rounded-full"
            src={avatar}
            alt=""
          />
          <div className="mt-16 px-4 pb-2 ">
            <div className="mb-4 text-center font-bold text-2xl text-[var(--main-color)]">
              Libra
            </div>
            <div className="flex items-center justify-start mb-4">
              <SvgIcon
                name="mail"
                size={24}
                color="text-[var(--text-color1)]"
              />
              <span className=" ml-2 text-[var(--text-color1)]">
                libra085925@gmail.com
              </span>
            </div>
            <div className="flex items-center justify-start">
              <SvgIcon
                name="github"
                size={24}
                color="text-[var(--text-color1)]"
              />
              <span className=" ml-2 text-[var(--text-color1)]">
                https://github.com/Libra11
              </span>
            </div>
            <div className="flex justify-center items-center ">
              <button className="bg-[var(--primary-color)] flex justify-center items-center text-white px-6 py-3 rounded-full hvr-outline-out mt-5">
                <span>Follow</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );
};
