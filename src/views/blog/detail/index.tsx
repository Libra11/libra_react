/**
 * Author: Libra
 * Date: 2024-01-03 13:44:34
 * LastEditors: Libra
 * Description:
 */
import "./index.scss";
import { useParams } from "react-router-dom";
import { getBlogByIdApi } from "@/api/blog";
import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dark } from "react-syntax-highlighter/dist/esm/styles/prism";

export const BlogDetailView: React.FC = () => {
  const { id } = useParams();
  const [markdown, setMarkdown] = useState("");
  const initBlogField = async () => {
    if (!id) return;
    const res = await getBlogByIdApi(Number(id));
    if (res.code === 200) {
      const blog = res.data.blog;
      setMarkdown(JSON.parse(blog.content));
    }
  };
  const displayWord = () => {
    // 获取文章和弹窗
    const article = document.getElementById("article");
    const popup = document.getElementById("popup");
    if (!article || !popup) return;

    // 在文章上添加鼠标悬停事件监听器
    article.addEventListener("mouseover", function (event) {
      // 检查鼠标悬停的元素是否是自定义标签
      if (event.target.className === "word") {
        popup.style.display = "block"; // 显示弹窗
      }
    });

    article.addEventListener("mouseout", function (event) {
      // 检查鼠标移开的元素是否是自定义标签
      if (event.target.className === "word") {
        popup.style.display = "none"; // 隐藏弹窗
      }
    });
  };
  useEffect(() => {
    initBlogField();
    setTimeout(() => {
      displayWord();
    }, 1000);
  }, []);
  return (
    <div>
      <div id="popup" style={{ display: "none", position: "absolute" }}>
        <p>This is a popup.</p>
      </div>
      <div id="article">
        <Markdown
          className="flex-1 h-full"
          rehypePlugins={[rehypeRaw]}
          remarkPlugins={[remarkGfm]}
          children={markdown}
          components={{
            code(props) {
              const { children, className, ...rest } = props;
              const match = /language-(\w+)/.exec(className || "");
              return match ? (
                <SyntaxHighlighter
                  {...rest}
                  PreTag="div"
                  children={String(children).replace(/\n$/, "")}
                  language={match[1]}
                  style={dark}
                  ref={null}
                />
              ) : (
                <code {...rest} className={className}>
                  {children}
                </code>
              );
            },
          }}
        />
      </div>
    </div>
  );
};
