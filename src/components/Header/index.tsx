/**
 * Author: Libra
 * Date: 2024-01-03 16:53:02
 * LastEditors: Libra
 * Description:
 */
import { Link, useLocation } from "react-router-dom";
import SvgIcon from "../Svg";
import { useSelector } from "react-redux";
import { Input } from "antd";

export const HeaderCom: React.FC = () => {
  const IsActive = (path: string) => {
    const location = useLocation();
    return location.pathname === path
      ? " text-[var(--main-color)] mr-6"
      : "mr-6 hover:text-[var(--main-color)]";
  };
  const isDark = useSelector((state: any) => state.system.isDark);
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
          home
        </Link>
        <Link className={IsActive("/blog/recent")} to="/blog/recent">
          blog
        </Link>
        <Link className={IsActive("/blog/word")} to="/blog/word">
          vocabulary
        </Link>
        <Link className={IsActive("/blog/category")} to="/blog/category">
          category
        </Link>
        <Link className={IsActive("/blog/tag")} to="/blog/tag">
          tag
        </Link>
      </div>
      <div className=" relative">
        <div className=" absolute right-3 top-3">
          <SvgIcon name="search" size={16} />
        </div>
        <Input
          size="large"
          className=" w-52 bg-[var(--main-color-10)] border-none rounded-full pl-6 pr-10 font-['montserrat'] text-[var(--text-color1)] placeholder:text-[var(--text-color2)] placeholder:text-sm"
          placeholder="Please input..."
        />
      </div>
    </div>
  );
};
