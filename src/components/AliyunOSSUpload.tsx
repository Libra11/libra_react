/**
 * Author: Libra
 * Date: 2023-12-15 17:13:40
 * LastEditors: Libra
 * Description:
 */
import { useEffect, useState, useCallback } from "react";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { Button, message, Upload } from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import { IToken, getOssTokenApi } from "@/api/blog";

interface AliyunOSSUploadProps {
  value?: string | undefined;
  onChange?: (fileName: string | undefined) => void;
  title: string;
  id?: string;
}

export const AliyunOSSUpload = ({
  value,
  onChange,
  title,
}: AliyunOSSUploadProps) => {
  const [OSSData, setOSSData] = useState<IToken>();

  const init = useCallback(async () => {
    try {
      const result = await getOssTokenApi();
      if (result.code === 200) {
        const res = result.data;
        setOSSData(res);
      }
    } catch (error: any) {
      message.error(error);
    }
  }, []);

  useEffect(() => {
    init();
  }, [init]);

  let fl: UploadFile<any>[] | undefined;
  const handleChange: UploadProps["onChange"] = ({ fileList }) => {
    fl = fileList;
    const files = fileList.map((file) => file.url);
    const host = OSSData?.host;
    onChange?.(`${host}/${files[0]}`);
  };

  const onRemove = (file: UploadFile) => {
    const files = value === file.url ? undefined : value;
    const host = OSSData?.host;
    if (onChange) {
      onChange(`${host}/${files}`);
    }
  };

  const getExtraData: UploadProps["data"] = (file) => ({
    key: file.url,
    OSSAccessKeyId: OSSData?.accessId,
    policy: OSSData?.policy,
    Signature: OSSData?.signature,
    "x-oss-security-token": OSSData?.securityToken,
  });

  const beforeUpload: UploadProps["beforeUpload"] = async (file) => {
    if (!OSSData) return false;
    const expire = Number(OSSData.expire) * 1000;
    if (expire < Date.now()) {
      await init();
    }
    const filename = file.name;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    file.url = OSSData.dir + filename;
    return file;
  };

  const uploadProps: UploadProps = {
    name: "file",
    fileList: fl,
    action: OSSData?.host,
    onChange: handleChange,
    onRemove,
    data: getExtraData,
    beforeUpload,
  };

  return (
    <Upload listType="picture" {...uploadProps} maxCount={1}>
      <Button icon={<UploadOutlined />}>{title}</Button>
    </Upload>
  );
};
