/*
 * @Author: Libra
 * @Date: 2023-12-22 17:36:56
 * @LastEditors: Libra
 * @Description:
 */
import { getOssTokenApi } from "@/api/blog";

const upload = async (file: File, onProgress?: any) => {
  const r = await getOssTokenApi();
  if (r.code === 200) {
    const { host, accessId, policy, signature, dir, securityToken } = r.data;
    const formData = new FormData();
    formData.append("key", `${dir}${file.name}`);
    formData.append("OSSAccessKeyId", accessId);
    formData.append("policy", policy);
    formData.append("signature", signature);
    formData.append("x-oss-security-token", securityToken);
    formData.append("file", file);
    const xhr = new XMLHttpRequest();
    xhr.open("POST", host, true);

    // 监听上传进度事件
    xhr.upload.onprogress = function (e) {
      if (e.lengthComputable) {
        const percentComplete = (e.loaded / e.total) * 100;
        onProgress && onProgress(percentComplete);
      }
    };

    // 发送请求
    xhr.send(formData);

    // 使用 Promise 包装 xhr.onload
    return new Promise((resolve, reject) => {
      xhr.onload = function () {
        if (xhr.status === 204) {
          console.log("上传成功", xhr.status, file.name);
          resolve(`${host}/${dir}${file.name}`);
        } else {
          reject(xhr.responseText);
        }
      };
    });
  }
};

function formatTimestamp(timestamp: number) {
  // 将毫秒转换为日期对象
  const date = new Date(timestamp);

  // 使用toLocaleString格式化日期和时间
  const formatted = date.toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  // 将格式化的日期和时间返回
  return formatted;
}

export { upload, formatTimestamp };
