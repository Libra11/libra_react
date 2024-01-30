/**
 * Author: Libra
 * Date: 2023-12-28 14:22:20
 * LastEditors: Libra
 * Description:
 */

import {
  ICategorys,
  ITags,
  blogInfo,
  deleteBlogApi,
  getBlogsApi,
} from "@/api/blog";
import { config } from "@/api/config";
import { formatTimestamp } from "@/utils";
import { Popconfirm, Space, Table, Tag } from "antd";
import Column from "antd/es/table/Column";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const BlogListView: React.FC = () => {
  const [dataSource, setDataSource] = useState<blogInfo[]>([]);
  const [paginationProps, setPaginationProps] = useState({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const navigate = useNavigate();

  const goEdit = (id: number) => {
    navigate(`/admin/blog/edit/${id}`);
  };

  useEffect(() => {
    getBlogList(page, pageSize);
  }, []);

  const getBlogList = async (page: number, pageSize: number) => {
    const res = await getBlogsApi({
      page,
      pageSize,
      title: "",
      tagId: 0,
      categoryId: 0,
    });
    if (res.code === 200) {
      const blogs = res.data.blogs.map((blog, index) => ({
        ...blog,
        key: index,
      }));
      setDataSource(blogs);
      const pp = {
        showSizeChanger: true,
        showQuickJumper: false,
        showTotal: () => `共${res.data.total}条`,
        pageSize,
        current: page,
        pageSizeOptions: ["10", "20", "30", "40"],
        total: res.data.total,
        onShowSizeChange: async (current: number, ps: number) => {
          await getBlogList(current, ps);
          setPage(current);
          setPageSize(ps);
        },
        onChange: (current: number) => {
          if (current === page) return;
          getBlogList(current, pageSize);
          setPage(current);
        },
      };
      setPaginationProps(pp);
    }
  };

  const deleteBlog = async (id: number) => {
    const res = await deleteBlogApi({ id });
    if (res.code === 200) {
      getBlogList(page, pageSize);
    }
  };
  // 表格分页属性
  return (
    <div>
      <Table dataSource={dataSource} pagination={paginationProps}>
        <Column title="标题" dataIndex="title" key="title" />
        <Column title="作者" dataIndex="author" key="author" />
        <Column title="描述" dataIndex="desc" key="desc" className=" w-96" />
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
          title="标签"
          dataIndex="tags"
          key="tags"
          render={(tags: ITags[]) => (
            <>
              {(tags || []).map((tag) => (
                <Tag key={tag.id}>{tag.name}</Tag>
              ))}
            </>
          )}
        />
        <Column
          title="分类"
          dataIndex="category"
          key="category"
          render={(categories: ICategorys[]) => (
            <>
              {(categories || []).map((category) => (
                <Tag key={category.id}>{category.name}</Tag>
              ))}
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
          title="封面图"
          dataIndex="imgUrl"
          key="imgUrl"
          render={(cover: string) =>
            cover ? (
              <img
                className=" w-20"
                src={`${config.FILE}${cover}`}
                alt="cover"
              />
            ) : null
          }
        />
        <Column
          title="操作"
          key="action"
          render={(value) => (
            <Space size="middle">
              <a onClick={() => goEdit(value.id)}>编辑</a>
              <Popconfirm
                title="删除博客"
                description="确定删除?"
                onConfirm={() => deleteBlog(value.id)}
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
