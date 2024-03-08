/**
 * Author: Libra
 * Date: 2024-01-03 10:20:12
 * LastEditors: Libra
 * Description:
 */
import "./index.scss";
import SvgIcon from "@/components/Svg";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export const BlogHomeView: React.FC = () => {
  const isDark = useSelector((state: any) => state.system.isDark);
  const navigate = useNavigate();
  const goAbout = () => {
    navigate("/blog/about");
  };
  const goRecent = () => {
    navigate("/blog/recent");
  };
  return (
    <div
      className="w-full flex items-center justify-center"
      style={{
        height: "calc(100vh - 100px)",
      }}
    >
      <div className="flex-1 h-full flex items-center justify-center">
        <div className="w-[450px] flex-col items-start justify-center">
          <div className="animate__animated animate__backInLeft text-[3.5rem] leading-[4.5rem] font-bold text-[var(--main-color)]">
            Keep moving forward.
          </div>
          <div className="animate__animated animate__backInLeft animate__delay mt-8 text-[1.3rem] text-[var(--text-color1)]">
            I'm a front-end developer, I love coding and sharing.
          </div>
          <div className="mt-8 flex justify-start items-center">
            <button
              onClick={goAbout}
              className="animate__animated animate__backInUp animate__delay-1s hvr-grow-shadow flex justify-center items-center text-black px-6 py-3 rounded-full mr-8"
            >
              <SvgIcon name="contact" size={16} />
              <span className=" ml-2">CONTACT</span>
            </button>
            <button
              onClick={goRecent}
              className="animate__animated animate__backInUp animate__delay-1s bg-[var(--primary-color)] flex justify-center items-center text-white px-6 py-3 rounded-full hvr-outline-out"
            >
              <span className=" mr-2">GO</span>
              <SvgIcon name="enter" size={16} />
            </button>
          </div>
        </div>
      </div>
      <div className="flex-1 h-full flex items-center justify-center animate__animated animate__fadeIn">
        <SvgIcon name={isDark ? "bg_dark" : "bg"} size="70%" />
      </div>
    </div>
  );
};
