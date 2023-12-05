/*
 * @Author: Libra
 * @Date: 2023-12-05 17:34:05
 * @LastEditors: Libra
 * @Description:
 */
const dev_url: string = "https://localhost:8881/blog/api/v1/";
const dev_service = {
  EXAM: `${dev_url}`,
};

const exam_prod_url: string = "https://localhost:8881/blog/api/v1/";
const prod_server = {
  EXAM: `${exam_prod_url}`,
};

let config: Record<string, string> = {};

switch (process.env.NODE_ENV) {
  case "development":
    config = dev_service;
    break;
  case "production":
    config = prod_server;
    break;
  default:
    break;
}
export { config };
