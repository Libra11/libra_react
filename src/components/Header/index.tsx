import { Link } from "react-router-dom";

/**
 * Author: Libra
 * Date: 2024-01-03 16:53:02
 * LastEditors: Libra
 * Description:
 */
export const HeaderCom: React.FC = () => {
  return (
    <div className=" flex justify-between h-20 bg-slate-400">
      <img src="" alt="" />
      <div className="flex justify-center items-center">
        <Link to="/blog/home">首页</Link>

        <Link to="/blog/recent">博客</Link>

        <Link to="/blog/word">单词</Link>

        <Link to="/blog/category">分类</Link>

        <Link to="/blog/tag">标签</Link>
      </div>
      <div></div>
    </div>
  );
};
