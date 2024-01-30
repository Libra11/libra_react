/**
 * Author: Libra
 * Date: 2024-01-03 17:31:06
 * LastEditors: Libra
 * Description:
 */
import {
  deleteWordApi,
  getWordByIdApi,
  getWordsApi,
  wordInfo,
} from "@/api/word";
import { formatTimestamp } from "@/utils";
import { Modal, Popconfirm, Space, Table } from "antd";
import Column from "antd/es/table/Column";
import { useEffect, useState } from "react";

export const WordListView: React.FC = () => {
  const [dataSource, setDataSource] = useState<wordInfo[]>([]);
  const [paginationProps, setPaginationProps] = useState({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [, setWordId] = useState(0);

  const showModal = (id: number) => {
    setWordId(id);
    setIsModalOpen(true);
    getWordByIdApi({ id });
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
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
  // const getBlogById = async (id: number) => {
  //   const res = await getWordByIdApi({ id });
  //   if (res.code === 200) {
  //     console.log(res.data);
  //   }
  // };
  const deleteWord = async (id: number) => {
    const res = await deleteWordApi({ id });
    if (res.code === 200) {
      getWordsList(page, pageSize);
    }
  };
  return (
    <div>
      <Modal
        title="编辑博客"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width={800}
      >
        {isModalOpen && <div>dddd</div>}
      </Modal>
      <Table dataSource={dataSource} pagination={paginationProps}>
        <Column title="单词" dataIndex="word" key="word" />
        <Column title="定义" dataIndex="definition" key="definition" />
        <Column title="示例" dataIndex="example" key="example" />
        <Column title="短语" dataIndex="phrase" key="phrase" />
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
