/**
 * Author: Libra
 * Date: 2023-12-11 10:59:04
 * LastEditors: Libra
 * Description:
 */
import EditorJS, { OutputData } from "@editorjs/editorjs";
import Header from "@editorjs/header";
import LinkTool from "@editorjs/link";
import editorjsCodeflask from "@calumk/editorjs-codeflask";
import List from "@editorjs/list";
import Table from "@editorjs/table";
import MarkerTool from "@/plugin/marker";
import ImageTool from "@editorjs/image";
import { Button, Form, Input, Select, SelectProps } from "antd";
import { useCallback, useEffect, useState } from "react";
import { AliyunOSSUpload } from "@/components/AliyunOSSUpload";

export const BlogView: React.FC = () => {
  const [editor, setEditor] = useState<EditorJS>();
  const [form] = Form.useForm();
  const initEditor = useCallback(
    (holder: string, readOnly = false, data?: OutputData) => {
      const editorConfig = {
        placeholder: "Let`s write an awesome story!",
        autofocus: true,
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
          image: {
            class: ImageTool,
            config: {
              endpoints: {
                byFile: "http://localhost:8008/uploadFile", // Your backend file uploader endpoint
                byUrl: "http://localhost:8008/fetchUrl", // Your endpoint that provides uploading by Url
              },
            },
          },
        },
      };
      const config: any = {
        ...editorConfig,
        holder,
        readOnly,
      };
      if (data) {
        config.data = data;
      }
      const e: EditorJS = new EditorJS(config);
      e.isReady.then(() => {
        console.log("Editor.js is ready to work!");
      });
      return e;
    },
    []
  );
  const saveBlog = () => {
    if (!editor) return;
    editor
      .save()
      .then((outputData) => {
        const e = initEditor("editorjs2", false, outputData);
        e.isReady.then(() => {
          e.readOnly.toggle();
          initListener();
        });
        console.log("Article data: ", outputData);
      })
      .catch((error) => {
        console.log("Saving failed: ", error);
      });
  };

  const initListener = () => {
    setTimeout(() => {
      const markers = document.querySelectorAll("#editorjs2 .cdx-marker");
      console.log("markers", markers);
      markers.forEach((marker) => {
        marker.addEventListener("click", () => {
          const data = (marker as HTMLElement).dataset;
          console.log("data", data.example, data.pronunciation, data.word);
        });
      });
    }, 100);
  };

  const onFinish = (values: any) => {
    saveBlog();
    console.log("Received values of form: ", values);
  };

  const options: SelectProps["options"] = [];

  for (let i = 10; i < 36; i++) {
    options.push({
      value: i.toString(36) + i,
      label: i.toString(36) + i,
    });
  }

  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
  };

  useEffect(() => {
    const e = initEditor("editorjs", false, undefined);
    setEditor(e);
  }, [initEditor]);

  return (
    <>
      <Form
        form={form}
        name="register"
        onFinish={onFinish}
        style={{ maxWidth: 600 }}
        scrollToFirstError
      >
        <Form.Item
          name="title"
          label="标题"
          rules={[
            {
              message: "请输入标题!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="desc"
          label="描述"
          rules={[
            {
              message: "请输入描述!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="category"
          label="分类"
          rules={[
            {
              message: "请输入分类!",
            },
          ]}
        >
          <Select
            mode="tags"
            style={{ width: "100%" }}
            placeholder="分类"
            onChange={handleChange}
            options={options}
          />
        </Form.Item>
        <Form.Item
          name="tag"
          label="标签"
          rules={[
            {
              message: "请输入标签!",
            },
          ]}
        >
          <Select
            mode="tags"
            style={{ width: "100%" }}
            placeholder="标签"
            onChange={handleChange}
            options={options}
          />
        </Form.Item>
        <Form.Item label="封面图" name="cover">
          <AliyunOSSUpload />
        </Form.Item>
      </Form>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          注册
        </Button>
      </Form.Item>
      <div id="editorjs"></div>
      <div id="editorjs2"></div>
    </>
  );
};
