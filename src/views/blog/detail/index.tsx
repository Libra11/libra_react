/**
 * Author: Libra
 * Date: 2024-01-03 13:44:34
 * LastEditors: Libra
 * Description:
 */
import "./index.scss";
import { useParams } from "react-router-dom";
import { IBlog, getBlogByIdApi } from "@/api/blog";
import { useEffect, useLayoutEffect, useState } from "react";
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
import { Spin } from "antd";

export const BlogDetailView: React.FC = () => {
  const { id } = useParams();
  const [markdown, setMarkdown] = useState("");
  const [blogInfo, setBlogInfo] = useState<IBlog>();
  const [word, setWord] = useState({
    word: "",
    definition: [],
    phrase: [],
    example: [],
    phonetic: "",
  });
  const [loadingWord, setLoadingWord] = useState(false);
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
    // 判断鼠标位置相对于浏览器窗口的位置是偏上还是偏下
    // 如果是偏下，弹窗显示在鼠标上方
    if (window.innerHeight - y < 500) {
      return `
        position: fixed;
        bottom: ${window.innerHeight - y + 10}px;
        left: ${x + 10}px;
      `;
    }
    return `
        position: fixed;
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
    article.addEventListener("click", async (event: any) => {
      // 检查鼠标悬停的元素是否是自定义标签
      if (event.target.className === "word") {
        const styleStr = checkMousePosition(event);
        if (!styleStr) return;
        popup.style.cssText = styleStr;
        popup.style.display = "block"; // 显示弹窗
        // get data-id
        const wordId = event.target.getAttribute("data-word");
        // get word info
        setLoadingWord(true);
        const res = await getWordByIdApi({ id: Number(wordId) });
        if (res.code === 200) {
          const { word, definition, phrase, example, phonetic } = res.data.word;
          const d = definition ? JSON.parse(definition) : [];
          const p = phrase ? JSON.parse(phrase) : [];
          const e = example ? JSON.parse(example) : [];
          setWord({
            word,
            definition: d,
            phrase: p,
            example: e,
            phonetic,
          });
          setLoadingWord(false);
        }
      }
    });

    article.addEventListener("click", function (event: any) {
      // 检查鼠标移开的元素是否是自定义标签
      if (event.target.className !== "word") {
        popup.style.cssText = "";
        popup.style.display = "none"; // 隐藏弹窗
        setWord({
          word: "",
          definition: [],
          phrase: [],
          example: [],
          phonetic: "",
        });
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
      2: "ml-4",
      3: "ml-8",
      4: "ml-12",
      5: "ml-16",
      6: "ml-20",
    };
    return mapping[level] || "ml-1";
  }

  useLayoutEffect(() => {
    displayWord();
    getMarkdownAnchor();
  }, [blogInfo]);

  useEffect(() => {
    initBlogField();
  }, []);
  return (
    <div className="blog-content w-[1280px] m-auto h-full">
      <div
        id="popup"
        style={{ display: "none", position: "fixed" }}
        className=" z-10 w-[260px] shadow-md rounded-lg border border-[var(--card-border)] bg-[var(--bg-color)] text-[var(--text-color2)] p-4"
      >
        {loadingWord ? (
          <Spin />
        ) : (
          <div>
            <div className="flex items-center justify-between">
              <div className="font-bold text-[var(--main-color)]">
                {word.word}
              </div>
              <div className="flex items-center justify-between"></div>
            </div>
            <div className="my-2 text-sm text-[var(--primary-color)] font-bold">
              {word.phonetic}
            </div>
            {word.definition.length ? (
              <div>
                <div className="my-2">
                  {word.definition.map((item: any, id: number) => {
                    return (
                      <div key={id}>
                        <span className=" font-bold">
                          {item.partOfSpeech}：
                        </span>
                        <span>{item.description}</span>
                      </div>
                    );
                  })}
                </div>
                <div className=" w-full h-[1px] bg-[var(--card-border)]"></div>
              </div>
            ) : null}
            {word.phrase.length ? (
              <div>
                <div className="my-2">
                  <span className=" font-bold ">Phrase</span>
                  {word.phrase.map((item: any, id: number) => {
                    return (
                      <div key={id} className="flex justify-start items-start">
                        <div className=" w-4">{id + 1}、</div>
                        <div className="flex-1">
                          <div>
                            {item.englishPhrase}：{item.chineseTranslation}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className=" w-full h-[1px] bg-[var(--card-border)]"></div>
              </div>
            ) : null}
            {word.example.length ? (
              <div className="mt-2">
                <div className=" font-bold">Example</div>
                {word.example.map((item: any, id: number) => {
                  return (
                    <div key={id}>
                      {id + 1}、{item.sentence}
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>
        )}
      </div>
      <div className="w-full h-full flex items-start justify-center">
        <div
          id="article"
          className=" leading-8 w-[968px] text-[var(--text-color1)]"
        >
          {blogInfo ? (
            <div>
              <div className=" text-4xl font-bold mt-2 text-[var(--main-color)] overflow-ellipsis line-clamp-2">
                {blogInfo.blog.title}
              </div>
              <div className="flex justify-between items-center my-2">
                <div className="flex">
                  {blogInfo.blog.category.map((item: any) => (
                    <div className="flex" key={item.id}>
                      <TagCom key={item.id} tag={item} />
                      <div className=" w-1"></div>
                    </div>
                  ))}
                </div>
                <div className="flex">
                  {blogInfo.blog.tags.map((item: any) => (
                    <div className="flex" key={item.id}>
                      <TagCom key={item.id} tag={item} />
                      <div className=" w-1"></div>
                    </div>
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
                className="w-full object-cover mt-1 rounded-lg"
                src={`${config.FILE}${blogInfo.blog.imgUrl}`}
                alt=""
              />
            </div>
          ) : null}
          <Markdown
            className="h-full mt-4"
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
            <div className="p-4 w-full max-h-[800px] overflow-scroll">
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
                          item.head.scrollIntoView({ block: "start" });
                          window.scrollBy(0, -100);
                        }
                      }}
                      className={`flex items-start justify-start cursor-pointer text-[var(--text-color1)] hover:text-[var(--primary-color)] 
                        ${getMarginClass(item.level)}`}
                    >
                      <div className=" mr-2">-</div>
                      <div>{item.text}</div>
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
