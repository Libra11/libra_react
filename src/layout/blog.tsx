/**
 * Author: Libra
 * Date: 2024-01-03 10:44:49
 * LastEditors: Libra
 * Description:
 */
import { FooterCom } from "@/components/Footer";
import { HeaderCom } from "@/components/Header";
import { Outlet } from "react-router-dom";

export const BlogLayout: React.FC = () => {
  return (
    <div className="w-full min-h-full flex flex-col bg-[var(--bg-color)]">
      <HeaderCom />
      <div className="font-['montserrat']">
        <Outlet />
      </div>
      <FooterCom />
    </div>
  );
};
