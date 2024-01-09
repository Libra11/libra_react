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
import { getWordByIdApi } from "@/api/word";

export const BlogDetailView: React.FC = () => {
  const { id } = useParams();
  const [markdown, setMarkdown] = useState("");
  const [word, setWord] = useState({
    word: "",
    definition: [],
    phrase: [],
    example: [],
  });
  const initBlogField = async () => {
    if (!id) return;
    const res = await getBlogByIdApi(Number(id));
    if (res.code === 200) {
      const blog = res.data.blog;
      setMarkdown(JSON.parse(blog.content));
    }
  };

  const checkMousePosition = (event: any) => {
    // 获取鼠标的位置
    const x = event.clientX;
    const y = event.clientY;
    return `
        position: absolute;
        top: ${y + 10}px;
        left: ${x + 10}px;
      `;
  };

  const displayWord = () => {
    // 获取文章和弹窗
    const article = document.getElementById("article");
    const popup = document.getElementById("popup");
    if (!article || !popup) return;

    // 在文章上添加鼠标悬停事件监听器
    article.addEventListener("mouseover", async (event: any) => {
      // 检查鼠标悬停的元素是否是自定义标签
      if (event.target.className === "word") {
        const styleStr = checkMousePosition(event);
        if (!styleStr) return;
        popup.style.cssText = styleStr;
        popup.style.display = "block"; // 显示弹窗
        // get data-id
        const wordId = event.target.getAttribute("data-word");
        // get word info
        const res = await getWordByIdApi({ id: Number(wordId) });
        if (res.code === 200) {
          const { word, definition, phrase, example } = res.data.word;
          const d = JSON.parse(definition);
          const p = JSON.parse(phrase);
          const e = JSON.parse(example);
          setWord({
            word,
            definition: d,
            phrase: p,
            example: e,
          });
        }
      }
    });

    article.addEventListener("mouseout", function (event: any) {
      // 检查鼠标移开的元素是否是自定义标签
      if (event.target.className === "word") {
        popup.style.cssText = "";
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
    <div className="blog-content">
      <div
        id="popup"
        style={{ display: "none", position: "absolute" }}
        className=" w-40 h-40 border border-gray-500 rounded-lg bg-white"
      >
        <div>
          <div>
            单词： <span className="text-red-500">{word.word}</span>
          </div>
          <div>
            定义：
            {word.definition.map((item: any, id: number) => {
              return (
                <div key={id}>
                  {item.partOfSpeech} {item.description}
                </div>
              );
            })}
          </div>
          <div>
            例句：
            {word.phrase.map((item: any, id: number) => {
              return (
                <div key={id}>
                  {item.englishPhrase} {item.chineseTranslation}
                </div>
              );
            })}
          </div>
          <div>
            短语：
            {word.example.map((item: any) => {
              return <div key={item.id}>{item.sentence}</div>;
            })}
          </div>
        </div>
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
