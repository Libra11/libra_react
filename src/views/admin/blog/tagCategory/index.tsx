/**
 * Author: Libra
 * Date: 2024-02-23 14:49:28
 * LastEditors: Libra
 * Description:
 */
import {
  ICategoryResult,
  ITagsResult,
  deleteCategoryApi,
  deleteTagApi,
  getAllCategoryApi,
  getAllTagsApi,
} from "@/api/blog";
import { Popconfirm, Space, Table } from "antd";
import Column from "antd/es/table/Column";
import { useEffect, useState } from "react";

export const TagCategoryView: React.FC = () => {
  const [tags, setTags] = useState<ITagsResult>({ tags: [] });
  const [categories, setCategories] = useState<ICategoryResult>({
    category: [],
  });

  const getTags = async () => {
    const res = await getAllTagsApi();
    if (res.code === 200) {
      setTags(res.data);
    }
  };

  const getCategory = async () => {
    const res = await getAllCategoryApi();
    if (res.code === 200) {
      setCategories(res.data);
    }
  };

  const deleteTag = async (id: number) => {
    const res = await deleteTagApi({ id });
    if (res.code === 200) {
      getTags();
    }
  };

  const deleteCategory = async (id: number) => {
    const res = await deleteCategoryApi({ id });
    if (res.code === 200) {
      getCategory();
    }
  };

  useEffect(() => {
    getTags();
    getCategory();
  }, []);
  return (
    <div className="flex justify-between w-full">
      <div className="flex-1">
        <Table dataSource={tags.tags}>
          <Column title="ID" dataIndex="id" key="id" />
          <Column title="标签" dataIndex="name" key="name" />
          <Column
            title="操作"
            key="action"
            render={(value) => (
              <Space size="middle">
                <Popconfirm
                  title="删除标签"
                  description="确定删除?"
                  onConfirm={() => deleteTag(value.id)}
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
      <div className="flex-1 pl-6">
        <Table dataSource={categories.category}>
          <Column title="ID" dataIndex="id" key="id" />
          <Column title="分类" dataIndex="name" key="name" />
          <Column
            title="操作"
            key="action"
            render={(value) => (
              <Space size="middle">
                <Popconfirm
                  title="删除分类"
                  description="确定删除?"
                  onConfirm={() => deleteCategory(value.id)}
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
    </div>
  );
};
