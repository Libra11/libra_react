/**
 * Author: Libra
 * Date: 2024-01-03 13:44:34
 * LastEditors: Libra
 * Description:
 */
import "./index.scss";
import { useParams } from "react-router-dom";
import { IBlog, getBlogByIdApi } from "@/api/blog";
import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { getWordByIdApi } from "@/api/word";
import { config } from "@/api/config";
import { formatTimestamp } from "@/utils";
import SvgIcon from "@/components/Svg";
import { TagCom } from "@/components/Tag";

export const BlogDetailView: React.FC = () => {
  const { id } = useParams();
  const [markdown, setMarkdown] = useState("");
  const [blogInfo, setBlogInfo] = useState<IBlog>();
  const [word, setWord] = useState({
    word: "",
    definition: [],
    phrase: [],
    example: [],
  });
  const [anchor, setAnchor] = useState([]);
  const initBlogField = async () => {
    if (!id) return;
    const res = await getBlogByIdApi(Number(id));
    if (res.code === 200) {
      const blog = res.data.blog;
      setMarkdown(JSON.parse(blog.content));
      setBlogInfo(res.data);
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

  const getMarkdownAnchor = () => {
    const headList = Array.from(document.querySelectorAll("h1,h2,h3,h4,h5,h6"));
    const article = document.getElementById("article");
    if (!article) return;
    const treeJson: any = [];
    for (let i = 0; i < headList.length; i++) {
      const head = headList[i] as HTMLElement;
      console.log(head);
      const text = head.innerText;
      const level = Number(head.tagName[1]);
      const item = {
        head,
        text,
        level,
      };
      treeJson.push(item);
    }
    setAnchor(treeJson);
  };

  // const getMarkdownAnchor2 = (markdown: string) => {
  //   const reg = /(#+)\s+(.*)/g;
  //   const treeJson: any = [];
  //   let result = null;
  //   while ((result = reg.exec(markdown)) !== null) {
  //     const level = result[1].length;
  //     const text = result[2];
  //     const item = {
  //       text,
  //       level,
  //     };
  //     treeJson.push(item);
  //   }
  //   console.log(treeJson);
  //   setAnchor(treeJson);
  // };

  function getMarginClass(level: number) {
    const mapping: any = {
      1: "ml-0",
      2: "ml-2",
      3: "ml-4",
      4: "ml-6",
      5: "ml-8",
      6: "ml-10",
    };
    return mapping[level] || "ml-1";
  }

  useEffect(() => {
    initBlogField();
    setTimeout(() => {
      displayWord();
      getMarkdownAnchor();
    }, 500);
  }, []);
  return (
    <div className="blog-content w-[1280px] m-auto h-full">
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
      <div className="h-full flex items-start justify-center">
        <div
          id="article"
          className=" leading-8 flex-1 text-[var(--text-color1)]"
        >
          {blogInfo ? (
            <div>
              <div className=" text-4xl font-bold mt-2 text-[var(--main-color)] overflow-ellipsis line-clamp-2">
                {blogInfo.blog.title}
              </div>
              <div className="flex justify-between items-center">
                <div className="">
                  {blogInfo.blog.category.map((item: any) => (
                    <TagCom key={item.id} tag={item} />
                  ))}
                </div>
                <div className="">
                  {blogInfo.blog.tags.map((item: any) => (
                    <TagCom key={item.id} tag={item} />
                  ))}
                </div>
              </div>
              <div className="mt-1 flex items-center justify-between w-full text-[var(--text-color1)] text-xs">
                <div className="flex items-center justify-center">
                  <SvgIcon
                    name="time"
                    size={18}
                    color="text-[var(--text-color1)]"
                  />
                  <div className="ml-1">
                    {formatTimestamp(blogInfo.blog.createAt)}
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <SvgIcon
                    name="update"
                    size={18}
                    color="text-[var(--text-color1)]"
                  />
                  <div className="ml-1">
                    {formatTimestamp(blogInfo.blog.updateAt)}
                  </div>
                </div>
              </div>
              <img
                className="w-full object-cover mt-4 rounded-lg"
                src={`${config.FILE}${blogInfo.blog.imgUrl}`}
                alt=""
              />
            </div>
          ) : null}
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
                    style={atomDark}
                    showLineNumbers={true}
                    wrapLines={true}
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
        <div className="w-[280px] border border-[var(--card-border)] rounded-[20px] hover:shadow-lg leading-8 font-bold sticky top-[120px] left-2 ml-8">
          {
            <div className="p-4">
              <div className="text-[var(--main-color)] font-bold text-xl">
                Anchor
              </div>
              <div className="mt-4">
                {anchor.map((item: any, id: number) => {
                  return (
                    <div
                      key={id}
                      onClick={() => {
                        if (item.head) {
                          item.head.scrollIntoView();
                        }
                      }}
                      className={`cursor-pointer text-[var(--text-color1)] hover:text-[var(--primary-color)] 
                        ${getMarginClass(item.level)}`}
                    >
                      {item.text}
                    </div>
                  );
                })}
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  );
};
