import { config } from "@/api/config";
import { useNavigate } from "react-router-dom";

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

export const BlogItem: React.FC<IBlogItemProps> = ({
  title,
  author,
  imgUrl,
  createAt,
  updateAt,
  category,
  desc,
  id,
}) => {
  const navigate = useNavigate();
  const goDetail = () => {
    navigate(`/blog/detail/${id}`);
  };
  return (
    <div
      onClick={goDetail}
      className=" w-40 h-60 rounded-lg shadow-lg overflow-hidden cursor-pointer"
    >
      <img className=" h-10" src={`${config.FILE}${imgUrl}`} alt="" />
      <div className="text-lg font-bold">{title}</div>
      <div className="p-2">
        <div className="flex justify-between">
          <div className="text-sm text-gray-500">{author}</div>
          <div className="text-sm text-gray-500">{createAt}</div>
        </div>
        <div className="text-sm text-gray-500">
          {category.map((item: any) => {
            return (
              <span key={item.id} className="mr-2">
                {item.name}
              </span>
            );
          })}
        </div>
        <div className="text-sm text-gray-500">{updateAt}</div>
        <div className="text-sm text-gray-500">{desc}</div>
      </div>
    </div>
  );
};
