/**
 * Author: Libra
 * Date: 2024-01-03 10:20:12
 * LastEditors: Libra
 * Description:
 */
import SvgIcon from "@/components/Svg";
import { useSelector } from "react-redux";

export const BlogHomeView: React.FC = () => {
  const isDark = useSelector((state: any) => state.system.isDark);
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="flex-1 h-full flex items-center justify-center">
        <div className="w-[450px] flex-col items-start justify-center">
          <div className=" text-[3.5rem] leading-[4.5rem] font-bold text-[var(--main-color)]">
            I don't know what I should write here.
          </div>
          <div className=" mt-8 text-[1.3rem] text-[var(--text-color1)]">
            I don't know what I should write here too.
          </div>
          <div className="mt-8 flex justify-start items-center">
            <button className="bg-[var(--primary-color)] flex justify-center items-center text-[var(--main-color)] px-6 py-3 rounded-full mr-8 shadow-md hover:shadow-xl">
              <SvgIcon name="contact" size={16} />
              <span className=" ml-2">CONTACT</span>
            </button>
            <button className="bg-[var(--bg-color)] border-2 border-[var(--main-color)] flex justify-center items-center text-[var(--main-color)] px-6 py-3 rounded-full shadow-md hover:shadow-xl">
              <span className=" mr-2">GO</span>
              <SvgIcon name="enter" size={16} />
            </button>
          </div>
        </div>
      </div>
      <div className="flex-1 h-full flex items-center justify-center">
        <SvgIcon name={isDark ? "bg_dark" : "bg"} size="70%" />
      </div>
    </div>
  );
};
