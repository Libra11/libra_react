import { config } from "@/api/config";
import { useNavigate } from "react-router-dom";
import { TagCom } from "../Tag";
import { formatTimestamp } from "@/utils";
import SvgIcon from "../Svg";
import "./index.scss";

/**
 * Author: Libra
 * Date: 2024-01-03 10:49:19
 * LastEditors: Libra
 * Description:
 */
interface IBlogItemProps {
  title: string;
  author: string;
  imgUrl: string;
  createAt: number;
  updateAt: number;
  category: any;
  desc: string;
  id: number;
}

interface IBlogItem {
  blog: IBlogItemProps;
}

export const BlogItem: React.FC<IBlogItem> = ({ blog }) => {
  const navigate = useNavigate();
  const goDetail = () => {
    navigate(`/blog/detail/${blog.id}`);
  };
  return (
    <div
      onClick={goDetail}
      className="image_scale animate__animated animate__headShake w-[220px] h-[320px] rounded-lg overflow-hidden cursor-pointer border border-[var(--card-border)] transition-all flex flex-col items-start justify-start mx-2"
    >
      <img
        className=" h-[158px] w-full object-cover"
        src={`${config.FILE}${blog.imgUrl}`}
        alt=""
      />
      <div className="w-full flex-1 p-2 flex flex-col items-start justify-center">
        <div className="text-base text-[var(--main-color)] font-bold overflow-ellipsis line-clamp-2 mb-1">
          {blog.title}
        </div>
        {blog.category.map((item: any) => {
          return <TagCom key={item.id} tag={item} />;
        })}
        <div className="text-xs text-[var(--text-color1)] overflow-ellipsis line-clamp-2 mt-2">
          {blog.desc}
        </div>
        <div className="text-xs mt-4 flex items-center justify-between w-full text-[var(--text-color1)]">
          <div className="flex items-center justify-center">
            <SvgIcon name="time" size={16} color="text-[var(--text-color1)]" />
            <div>{formatTimestamp(blog.createAt, false)}</div>
          </div>
          <div className="flex items-center justify-center ml-1">
            <SvgIcon
              name="update"
              size={16}
              color="text-[var(--text-color1)]"
            />
            <div>{formatTimestamp(blog.updateAt, false)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
