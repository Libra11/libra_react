/**
 * Author: Libra
 * Date: 2024-01-03 16:53:02
 * LastEditors: Libra
 * Description:
 */
import { Link, useLocation, useNavigate } from "react-router-dom";
import SvgIcon from "../Svg";
import { useSelector } from "react-redux";
import { Input, List } from "antd";
import { debounce } from "@/utils";
import { blogInfo, getBlogsApi } from "@/api/blog";
import { useState } from "react";

export const HeaderCom: React.FC = () => {
  const IsActive = (path: string) => {
    const location = useLocation();
    return location.pathname === path
      ? " text-[var(--primary-color)] mr-6"
      : "mr-6 hover:text-[var(--primary-color)]";
  };
  const isDark = useSelector((state: any) => state.system.isDark);
  const searchDebounce = debounce((value: string) => {
    getBlogsListByTitle(1, 8, value);
  }, 500);

  const [blogs, setBlogs] = useState<blogInfo[]>([]);

  const getBlogsListByTitle = async (
    page: number,
    pageSize: number,
    title: string
  ) => {
    if (!title) return;
    const res = await getBlogsApi({
      page,
      pageSize,
      title,
      tagId: 0,
      categoryId: 0,
    });
    if (res.code === 200) {
      if (res.data.blogs) {
        setBlogs(res.data.blogs);
      } else {
        setBlogs([]);
      }
    }
  };

  const navigate = useNavigate();
  const goToBlogDetail = (id: number) => {
    navigate(`/blog/detail/${id}`);
  };
  return (
    <div className="sticky top-0 left-0 flex justify-between items-center h-[100px] bg-[var(--bg-color)] px-8">
      <div className=" flex items-center justify-center">
        <SvgIcon name={isDark ? "logo_dark" : "logo"} size={24} />
        <span className=" ml-1 text-[var(--main-color)] text-xl font-bold">
          Libra
        </span>
      </div>
      <div className="flex justify-center items-center text-[var(--text-color2)] text-base">
        <Link className={IsActive("/blog/home")} to="/blog/home">
          HOME
        </Link>
        <Link className={IsActive("/blog/recent")} to="/blog/recent">
          BLOG
        </Link>
        {/* <Link className={IsActive("/blog/word")} to="/blog/word">
          vocabulary
        </Link> */}
        <Link className={IsActive("/blog/category")} to="/blog/category">
          CATEGORY
        </Link>
        <Link className={IsActive("/blog/tag")} to="/blog/tag">
          TAG
        </Link>
        <Link className={IsActive("/blog/about")} to="/blog/about">
          ABOUT
        </Link>
      </div>
      <div className=" relative">
        <div className=" absolute right-3 top-3">
          <SvgIcon name="search" size={16} />
        </div>
        {blogs.length ? (
          <List
            className="absolute top-12 left-0 w-[208px] rounded-md border-[var(--main-color-10)] border"
            itemLayout="horizontal"
            dataSource={blogs}
            renderItem={(item) => (
              <List.Item
                onClick={() => {
                  goToBlogDetail(item.id);
                }}
                className=" cursor-pointer hover:bg-[var(--main-color-10)] hover:text-[var(--main-color)]  text-ellipsis !px-2
            "
              >
                {item.title}
              </List.Item>
            )}
          />
        ) : null}
        <Input
          size="large"
          className=" w-52 bg-[var(--main-color-10)] border-none rounded-md pl-6 pr-10 font-['montserrat'] text-[var(--text-color1)] placeholder:text-[var(--text-color2)] placeholder:text-sm"
          placeholder="Please input..."
          onBlur={() => {
            setTimeout(() => {
              setBlogs([]);
            }, 200);
          }}
          onChange={(e) => searchDebounce(e.target.value)}
        />
      </div>
    </div>
  );
};
