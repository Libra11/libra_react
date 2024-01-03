/**
 * Author: Libra
 * Date: 2024-01-03 13:44:34
 * LastEditors: Libra
 * Description:
 */
import { useParams } from "react-router-dom";
import EditorJS, { OutputData } from "@editorjs/editorjs";
import Header from "@editorjs/header";
import LinkTool from "@editorjs/link";
import editorjsCodeflask from "@calumk/editorjs-codeflask";
import List from "@editorjs/list";
import Table from "@editorjs/table";
import MarkerTool from "@/plugin/marker";
import ImageTool from "@editorjs/image";
import { getBlogByIdApi } from "@/api/blog";
import { useEffect } from "react";

export const BlogDetailView: React.FC = () => {
  const { id } = useParams();
  const initEditor = (holder: string, data?: OutputData) => {
    const editorConfig = {
      placeholder: "",
      autofocus: false,
      readOnly: true,
      defaultBlock: "paragraph",
      tools: {
        header: Header,
        link: LinkTool,
        code: editorjsCodeflask,
        list: List,
        table: {
          class: Table,
          inlineToolbar: true,
        },
        MarkerTool,
        image: ImageTool,
      },
    };
    const config: any = {
      ...editorConfig,
      holder,
    };
    if (data) {
      config.data = data;
    }
    const e: EditorJS = new EditorJS(config);
    e.isReady.then(() => {
      console.log("Editor.js is ready to work!");
    });
    return e;
  };
  const initBlogField = async () => {
    if (!id) return;
    const res = await getBlogByIdApi(Number(id));
    if (res.code === 200) {
      const blog = res.data.blog;
      const content = JSON.parse(blog.content);
      initEditor("editor", content);
    }
  };

  useEffect(() => {
    initBlogField();
  }, []);
  return (
    <div>
      <div id="editor"></div>
    </div>
  );
};
