/*
 * @Author: Libra
 * @Date: 2023-12-22 17:36:56
 * @LastEditors: Libra
 * @Description:
 */
import { getOssTokenApi } from "@/api/blog";

/**
 * Uploads a file to the server.
 *
 * @param file - The file to be uploaded.
 * @param onProgress - Optional callback function to track the upload progress.
 * @returns A Promise that resolves to the uploaded file URL if successful, or rejects with an error message.
 */
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

/**
 * 格式化时间戳为指定格式的日期字符串
 * @param timestamp - 要格式化的时间戳（单位：毫秒）
 * @param hasTime - 是否包含时间，默认为 true
 * @returns 格式化后的日期字符串
 */
function formatTimestamp(timestamp: number, hasTime: boolean = true) {
  // 将毫秒转换为日期对象
  const date = new Date(timestamp);

  // 使用toLocaleString格式化日期和时间
  const formattedHaveTime = date.toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const formattedNoTime = date.toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  // 将格式化的日期和时间返回
  return hasTime ? formattedHaveTime : formattedNoTime;
}

function debounce<F extends (...args: any[]) => any>(
  func: F,
  wait: number
): (...args: Parameters<F>) => void {
  let timeout: NodeJS.Timeout | null;

  return function executedFunction(...args: Parameters<F>) {
    const later = () => {
      clearTimeout(timeout!);
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

export { upload, formatTimestamp, debounce };
