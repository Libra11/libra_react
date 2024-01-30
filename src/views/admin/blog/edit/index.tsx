/**
 * Author: Libra
 * Date: 2024-01-15 10:26:15
 * LastEditors: Libra
 * Description:
 */

import { BlogCom } from "@/components/Blog";
import { useParams } from "react-router-dom";

export const EditBlogView: React.FC = () => {
  const { id } = useParams();
  return <BlogCom id={Number(id)} />;
};
