/**
 * Author: Libra
 * Date: 2023-12-28 17:59:21
 * LastEditors: Libra
 * Description:
 */
import "./index.css";
import EditorJS, { OutputData } from "@editorjs/editorjs";
import Header from "@editorjs/header";
import LinkTool from "@editorjs/link";
import editorjsCodeflask from "@calumk/editorjs-codeflask";
import List from "@editorjs/list";
import Table from "@editorjs/table";
import MarkerTool from "@/plugin/marker";
import ImageTool from "@editorjs/image";
import {
  Button,
  Divider,
  Form,
  Input,
  InputRef,
  Select,
  SelectProps,
  Space,
} from "antd";
import { useEffect, useRef, useState } from "react";
import { AliyunOSSUpload } from "@/components/AliyunOSSUpload";
import {
  IBlog,
  addBlogApi,
  addCategoryApi,
  addTagApi,
  getAllCategoryApi,
  getAllTagsApi,
  getBlogByIdApi,
} from "@/api/blog";
import { PlusOutlined } from "@ant-design/icons";
import { upload } from "@/utils";
import { config } from "@/api/config";

interface BlogComProps {
  id?: number;
}

export const BlogCom: React.FC<BlogComProps> = ({ id }) => {
  const [editor, setEditor] = useState<EditorJS>();
  const [form] = Form.useForm();
  const initEditor = (holder: string, data?: OutputData) => {
    const editorConfig = {
      placeholder: "Let`s write an awesome story!",
      autofocus: true,
      readOnly: false,
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
            caption: false,
            uploader: {
              async uploadByFile(file: File) {
                try {
                  const res = await upload(file);
                  form.setFieldValue("imgUrl", res);
                  return {
                    success: 1,
                    file: {
                      url: res,
                    },
                  };
                } catch (err) {
                  console.log(err);
                }
              },
              async uploadByUrl(url: string) {
                try {
                  const response = await fetch(url);
                  const blob = await response.blob();
                  const file = new File([blob], "downloaded_image.jpg", {
                    type: blob.type,
                  });
                  const res = await upload(file);
                  return {
                    success: 1,
                    file: {
                      url: res,
                    },
                  };
                } catch (err) {
                  console.log(err);
                }
              },
            },
          },
        },
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
  const initBlogField = async (id: number) => {
    const res = await getBlogByIdApi(id);
    if (res.code === 200) {
      const blog = res.data.blog;
      const content = JSON.parse(blog.content);
      const formData = {
        title: blog.title,
        desc: blog.desc,
        imgUrl: blog.imgUrl,
        category: (blog.category || []).map((item: any) => ({
          label: item.name,
          value: String(item.id),
        })),
        tags: (blog.tags || []).map((item: any) => ({
          label: item.name,
          value: String(item.id),
        })),
      };
      form.setFieldsValue(formData);
      if (!editor) {
        const e = initEditor("editorjs", content);
        setEditor(e);
      } else {
        editor.render(content);
      }
    }
  };
  const save = () => {
    if (!editor) return;
    editor
      .save()
      .then(async (outputData) => {
        const formData = form.getFieldsValue();
        console.log("Article data: ", outputData);
        const formDataFormat = {
          ...formData,
          createAt: new Date().getTime(),
          updateAt: new Date().getTime(),
          audioFile: "",
          author: "Libra",
          category: formData.category.map((item: any) => {
            return {
              id: Number(item.value),
              name: item.label,
            };
          }),
          tags: formData.tags.map((item: any) => {
            return {
              id: Number(item.value),
              name: item.label,
            };
          }),
        };
        const blog: IBlog = {
          blog: {
            ...formDataFormat,
            content: JSON.stringify(outputData),
          },
        };
        if (id) {
          blog.blog.id = id;
        }
        await saveBlog(blog);
      })
      .catch((error) => {
        console.log("Saving failed: ", error);
      });
  };

  const saveBlog = async (blog: IBlog) => {
    const res = await addBlogApi(blog);
    if (res.code === 200) {
      console.log("保存成功");
    }
  };

  const onFinish = (values: any) => {
    save();
    console.log("Received values of form: ", values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const [tagOptions, setTagOptions] = useState<SelectProps["options"]>([]);
  const [categoryOptions, setCategoryOptions] = useState<
    SelectProps["options"]
  >([]);

  const handleTagChange = (value: string) => {
    console.log(`selected ${value}`);
  };

  const handleCategoryChange = (value: string) => {
    console.log(`selected ${value}`);
  };

  const getTags = async () => {
    const res = await getAllTagsApi();
    if (res.code === 200) {
      const tags = res.data.tags.map((item) => ({
        label: item.name,
        value: String(item.id),
      }));
      setTagOptions(tags);
    }
  };

  const getCategory = async () => {
    const res = await getAllCategoryApi();
    if (res.code === 200) {
      const category = res.data.category.map((item) => ({
        label: item.name,
        value: String(item.id),
      }));
      setCategoryOptions(category);
    }
  };

  const [tag, setTag] = useState("");
  const inputTagRef = useRef<InputRef>(null);

  const onTagChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTag(event.target.value);
  };

  const addTag = async (
    e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>
  ) => {
    e.preventDefault();
    const res = await addTagApi({
      tag: { name: tag },
    });
    if (res.code === 200) {
      const tags = tagOptions?.length ? [...tagOptions] : [];
      tags.push({
        label: tag,
        value: String(res.data),
      });
      setTagOptions(tags);
    }
    setTag("");
    setTimeout(() => {
      inputTagRef.current?.focus();
    }, 0);
  };

  const [category, setCategory] = useState("");
  const inputCategoryRef = useRef<InputRef>(null);

  const onCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCategory(event.target.value);
  };

  const addCategory = async (
    e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>
  ) => {
    e.preventDefault();
    const res = await addCategoryApi({
      category: { name: category },
    });
    if (res.code === 200) {
      const categorys = categoryOptions?.length ? [...categoryOptions] : [];
      categorys.push({
        label: category,
        value: String(res.data),
      });
      setCategoryOptions(categorys);
    }
    setCategory("");
    setTimeout(() => {
      inputCategoryRef.current?.focus();
    }, 0);
  };

  useEffect(() => {
    getTags();
    getCategory();
    if (id) {
      initBlogField(id);
    } else {
      const e = initEditor("editorjs", undefined);
      setEditor(e);
    }
  }, [id]);

  return (
    <>
      <Form
        form={form}
        name="register"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
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
        <Form.Item name="category" label="分类">
          <Select
            labelInValue
            mode="tags"
            style={{ width: "100%" }}
            placeholder="分类"
            onChange={handleCategoryChange}
            options={categoryOptions}
            dropdownRender={(menu) => (
              <>
                {menu}
                <Divider style={{ margin: "8px 0" }} />
                <Space style={{ padding: "0 8px 4px" }}>
                  <Input
                    placeholder="请输入分类"
                    ref={inputCategoryRef}
                    value={category}
                    onChange={onCategoryChange}
                    onKeyDown={(e) => e.stopPropagation()}
                  />
                  <Button
                    type="text"
                    icon={<PlusOutlined />}
                    onClick={addCategory}
                  >
                    添加分类
                  </Button>
                </Space>
              </>
            )}
          />
        </Form.Item>
        <Form.Item name="tags" label="标签">
          <Select
            labelInValue
            mode="tags"
            style={{ width: "100%" }}
            placeholder="标签"
            onChange={handleTagChange}
            options={tagOptions}
            dropdownRender={(menu) => (
              <>
                {menu}
                <Divider style={{ margin: "8px 0" }} />
                <Space style={{ padding: "0 8px 4px" }}>
                  <Input
                    placeholder="请输入标签"
                    ref={inputTagRef}
                    value={tag}
                    onChange={onTagChange}
                    onKeyDown={(e) => e.stopPropagation()}
                  />
                  <Button type="text" icon={<PlusOutlined />} onClick={addTag}>
                    添加标签
                  </Button>
                </Space>
              </>
            )}
          />
        </Form.Item>
        <Form.Item label="封面图" name="imgUrl">
          <AliyunOSSUpload title={id ? "更换" : "上传"} />
        </Form.Item>
        {id ? (
          <img
            src={`${config.FILE}${form.getFieldValue("imgUrl")}`}
            alt="cover"
          />
        ) : null}
        <Form.Item>
          <Button type="primary" htmlType="submit">
            保存
          </Button>
        </Form.Item>
      </Form>
      <div id="editorjs"></div>
    </>
  );
};
