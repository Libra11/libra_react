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
  value?: UploadFile[];
  onChange?: (fileList: UploadFile[]) => void;
}

export const AliyunOSSUpload = ({ value, onChange }: AliyunOSSUploadProps) => {
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

  const handleChange: UploadProps["onChange"] = ({ fileList }) => {
    console.log("Aliyun OSS:", fileList);
    onChange?.([...fileList]);
  };

  const onRemove = (file: UploadFile) => {
    const files = (value || []).filter((v) => v.url !== file.url);

    if (onChange) {
      onChange(files);
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
    console.log(OSSData);
    if (!OSSData) return false;

    const expire = Number(OSSData.expire) * 1000;

    if (expire < Date.now()) {
      await init();
    }

    const suffix = file.name.slice(file.name.lastIndexOf("."));
    const filename = Date.now() + suffix;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    file.url = OSSData.dir + filename;

    return file;
  };

  const uploadProps: UploadProps = {
    name: "file",
    fileList: value,
    action: OSSData?.host,
    onChange: handleChange,
    onRemove,
    data: getExtraData,
    beforeUpload,
  };

  return (
    <Upload {...uploadProps}>
      <Button icon={<UploadOutlined />}>Click to Upload</Button>
    </Upload>
  );
};
