/**
 * Author: Libra
 * Date: 2023-12-28 17:59:21
 * LastEditors: Libra
 * Description:
 */
import {
  Button,
  Divider,
  Form,
  Input,
  InputRef,
  Select,
  SelectProps,
  Space,
  Dropdown,
  Modal,
  MenuProps,
  message,
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
import { config } from "@/api/config";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { CloseOutlined } from "@ant-design/icons";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import TextArea from "antd/es/input/TextArea";
import { addWordApi } from "@/api/word";
import "./index.scss";

interface BlogComProps {
  id?: number;
}

export const BlogCom: React.FC<BlogComProps> = ({ id }) => {
  const [markdown, setMarkdown] = useState<string>("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [formBlog] = Form.useForm();
  const [messageApi] = message.useMessage();
  const [createAt, setCreateAt] = useState<number>(0);
  const [selectText, setSelectText] = useState<string>("");
  const [JSONStr, setJSONStr] = useState<string>("");
  const onJSONChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setJSONStr(e.target.value);
    const obj = JSON.parse(e.target.value);
    console.log(obj);
    form.setFieldsValue(obj);
  };

  const markdownChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMarkdown(e.target.value);
  };

  const handleSave = () => {
    saveWord()
      .then((res: any) => {
        const textarea: HTMLTextAreaElement = document.getElementById(
          "libra_input"
        ) as HTMLTextAreaElement;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const replaceText = `<span class="word" data-word="${res.id}">${selectText}</span>`;
        setMarkdown(
          markdown.substring(0, start) + replaceText + markdown.substring(end)
        );
        setIsModalVisible(false);
        form.resetFields();
        setJSONStr("");
      })
      .catch((err) => {
        messageApi.error(err.message);
      });
  };
  const saveWord = () => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      const formData = form.getFieldsValue();
      const paramWord = {
        word: {
          word: formData.word,
          phonetic: formData.phonetic,
          definition: JSON.stringify(formData.definition),
          phrase: JSON.stringify(formData.phrase),
          example: JSON.stringify(formData.example),
          createAt: new Date().getTime(),
          updateAt: new Date().getTime(),
        },
      };
      const res = await addWordApi(paramWord);
      if (res.code === 200) {
        messageApi.success("添加成功");
        resolve(res.data);
      } else {
        reject(res);
      }
    });
  };

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <div className="flex items-center">
          <div className="mr-2">添加单词</div>
        </div>
      ),
      onClick: () => {
        setIsModalVisible(true);
        setTimeout(() => {
          form.setFieldsValue({
            word: selectText,
          });
        }, 0);
      },
    },
  ];
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
      formBlog.setFieldsValue(formData);
      setCreateAt(blog.createAt);
      setMarkdown(content);
    }
  };
  const save = async () => {
    const formData = formBlog.getFieldsValue();
    const formDataFormat = {
      ...formData,
      createAt: createAt || new Date().getTime(),
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
        content: JSON.stringify(markdown),
      },
    };
    if (id) {
      blog.blog.id = id;
    }
    await saveBlog(blog);
  };

  const saveBlog = async (blog: IBlog) => {
    const res = await addBlogApi(blog);
    if (res.code === 200) {
      console.log("保存成功");
    }
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
    const article = document.getElementById("libra_input");
    if (article) {
      article.addEventListener("select", () => {
        const selectText = window.getSelection()?.toString();
        setSelectText(selectText || "");
      });
    }
    if (id) {
      initBlogField(id);
    }
    return () => {
      article?.removeEventListener("select", () => {});
    };
  }, [id]);

  return (
    <div className="h-full flex-col flex justify-start items-start">
      <Modal
        title="Basic Modal"
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setJSONStr("");
        }}
        onOk={handleSave}
      >
        <Form
          form={form}
          name="dynamic_form_complex"
          style={{ maxWidth: 600 }}
          autoComplete="off"
          initialValues={{ words: [{}] }}
        >
          <Form.Item label="单词" name="word">
            <Input />
          </Form.Item>
          <Form.Item label="音标" name="phonetic">
            <Input />
          </Form.Item>
          <Form.Item label="定义">
            <Form.List name="definition">
              {(subFields, subOpt) => (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    rowGap: 16,
                  }}
                >
                  {subFields.map((subField) => (
                    <Space key={subField.key}>
                      <Form.Item noStyle name={[subField.name, "partOfSpeech"]}>
                        <Select
                          style={{ width: 140 }}
                          options={[
                            { value: "noun", label: "n. (名词)" },
                            { value: "verb", label: "v. (动词)" },
                            { value: "adjective", label: "adj. (形容词)" },
                            { value: "adverb", label: "adv. (副词)" },
                            { value: "pronoun", label: "pron. (代词)" },
                            { value: "preposition", label: "prep. (介词)" },
                            { value: "conjunction", label: "conj. (连词)" },
                            {
                              value: "interjection",
                              label: "interj. (感叹词)",
                            },
                          ]}
                        />
                      </Form.Item>
                      <Form.Item noStyle name={[subField.name, "description"]}>
                        <Input placeholder="释义" />
                      </Form.Item>
                      <CloseOutlined
                        onClick={() => {
                          subOpt.remove(subField.name);
                        }}
                      />
                    </Space>
                  ))}
                  <Button type="dashed" onClick={() => subOpt.add()} block>
                    + 添加定义
                  </Button>
                </div>
              )}
            </Form.List>
          </Form.Item>
          <Form.Item label="短语">
            <Form.List name="phrase">
              {(subFields, subOpt) => (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    rowGap: 16,
                  }}
                >
                  {subFields.map((subField) => (
                    <Space key={subField.key}>
                      <Form.Item
                        noStyle
                        name={[subField.name, "englishPhrase"]}
                      >
                        <Input placeholder="短语" />
                      </Form.Item>
                      <Form.Item
                        noStyle
                        name={[subField.name, "chineseTranslation"]}
                      >
                        <Input placeholder="释义" />
                      </Form.Item>
                      <CloseOutlined
                        onClick={() => {
                          subOpt.remove(subField.name);
                        }}
                      />
                    </Space>
                  ))}
                  <Button type="dashed" onClick={() => subOpt.add()} block>
                    + 添加短语
                  </Button>
                </div>
              )}
            </Form.List>
          </Form.Item>
          <Form.Item label="例句">
            <Form.List name="example">
              {(subFields, subOpt) => (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    rowGap: 16,
                  }}
                >
                  {subFields.map((subField) => (
                    <Space key={subField.key}>
                      <Form.Item noStyle name={[subField.name, "sentence"]}>
                        <Input placeholder="例句" />
                      </Form.Item>
                      <CloseOutlined
                        onClick={() => {
                          subOpt.remove(subField.name);
                        }}
                      />
                    </Space>
                  ))}
                  <Button type="dashed" onClick={() => subOpt.add()} block>
                    + 添加例句
                  </Button>
                </div>
              )}
            </Form.List>
          </Form.Item>
        </Form>
        <Input
          placeholder="请输入JSON格式的数据"
          value={JSONStr}
          onChange={onJSONChange}
        />
      </Modal>
      <div>
        <Form
          form={formBlog}
          name="register"
          className="flex justify-start items-start w-full mt-3"
          scrollToFirstError
        >
          <div className=" w-[500px] mr-6">
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
                      <Button
                        type="text"
                        icon={<PlusOutlined />}
                        onClick={addTag}
                      >
                        添加标签
                      </Button>
                    </Space>
                  </>
                )}
              />
            </Form.Item>
          </div>
          <div className="w-[500px]">
            <Form.Item label="封面图" name="imgUrl">
              <AliyunOSSUpload title={id ? "更换" : "上传"} />
            </Form.Item>
            {id ? (
              <img
                src={`${config.FILE}${formBlog.getFieldValue("imgUrl")}`}
                alt="cover"
              />
            ) : null}
          </div>
        </Form>
      </div>
      <div className="flex justify-center items-start max-h-[1200px] overflow-auto w-full mt-3">
        <Dropdown menu={{ items }} trigger={["contextMenu"]}>
          <TextArea
            id="libra_input"
            onChange={markdownChange}
            value={markdown}
            className="flex-1 !h-full overflow-auto"
          />
        </Dropdown>
        <Markdown
          className="text-[var(--text-color1)] flex-1 h-full border border-[var(--card-border)] rounded-lg p-5 ml-5 overflow-auto"
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
      <Button type="primary" onClick={save} className=" mt-2">
        保存
      </Button>
    </div>
  );
};
