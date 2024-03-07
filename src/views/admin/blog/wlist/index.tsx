/**
 * Author: Libra
 * Date: 2024-01-03 17:31:06
 * LastEditors: Libra
 * Description:
 */
import {
  addWordApi,
  deleteWordApi,
  getWordByIdApi,
  getWordsApi,
  wordInfo,
} from "@/api/word";
import { formatTimestamp } from "@/utils";
import {
  Button,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  message,
} from "antd";
import Column from "antd/es/table/Column";
import { useEffect, useState } from "react";
import { CloseOutlined } from "@ant-design/icons";

export const WordListView: React.FC = () => {
  const [dataSource, setDataSource] = useState<wordInfo[]>([]);
  const [paginationProps, setPaginationProps] = useState({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [, setWordId] = useState(0);
  const [form] = Form.useForm();
  const [messageApi] = message.useMessage();

  const showModal = async (id: number) => {
    setWordId(id);
    setIsModalOpen(true);
    const res = await getWordByIdApi({ id });
    if (res.code === 200) {
      const { word } = res.data;
      word.definition = word.definition ? JSON.parse(word.definition) : [];
      word.phrase = word.phrase ? JSON.parse(word.phrase) : [];
      word.example = word.example ? JSON.parse(word.example) : [];
      form.setFieldsValue(word);
    }
  };

  const handleOk = () => {
    saveWord().then(() => {
      form.resetFields();
      setIsModalOpen(false);
      getWordsList(page, pageSize);
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

  useEffect(() => {
    getWordsList(page, pageSize);
  }, []);

  const getWordsList = async (page: number, pageSize: number) => {
    const res = await getWordsApi({
      page,
      pageSize,
    });
    if (res.code === 200) {
      const words = res.data.words.map((word, index) => ({
        ...word,
        key: index,
      }));
      setDataSource(words);
      const pp = {
        showSizeChanger: true,
        showQuickJumper: false,
        showTotal: () => `共${res.data.total}条`,
        pageSize,
        current: page,
        pageSizeOptions: ["10", "20", "30", "40"],
        total: res.data.total,
        onShowSizeChange: async (current: number, ps: number) => {
          await getWordsList(current, ps);
          setPage(current);
          setPageSize(ps);
        },
        onChange: (current: number) => {
          if (current === page) return;
          getWordsList(current, pageSize);
          setPage(current);
        },
      };
      setPaginationProps(pp);
    }
  };
  const deleteWord = async (id: number) => {
    const res = await deleteWordApi({ id });
    if (res.code === 200) {
      getWordsList(page, pageSize);
    }
  };
  return (
    <div>
      <Modal
        title="编辑单词"
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        onOk={() => handleOk()}
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
      </Modal>
      <Table dataSource={dataSource} pagination={paginationProps}>
        <Column title="单词" dataIndex="word" key="word" />
        <Column
          title="定义"
          dataIndex="definition"
          key="definition"
          render={(definition: string) =>
            JSON.parse(definition).map((item: any, index: number) => {
              return (
                <div key={index}>
                  <div>{item.partOfSpeech}</div>
                  <div>{item.description}</div>
                </div>
              );
            })
          }
        />
        <Column
          title="创建时间"
          dataIndex="createAt"
          key="createAt"
          render={(createAt: number) => (
            <>
              <span>{formatTimestamp(createAt)}</span>
            </>
          )}
        />
        <Column
          title="更新时间"
          dataIndex="updateAt"
          key="updateAt"
          render={(updateAt: number) => (
            <>
              <span>{formatTimestamp(updateAt)}</span>
            </>
          )}
        />
        <Column
          title="操作"
          key="action"
          render={(value) => (
            <Space size="middle">
              <a onClick={() => showModal(value.id)}>编辑</a>
              <Popconfirm
                title="删除单词"
                description="确定删除?"
                onConfirm={() => deleteWord(value.id)}
                okText="确定"
                cancelText="取消"
              >
                <a>删除</a>
              </Popconfirm>
            </Space>
          )}
        />
      </Table>
    </div>
  );
};
