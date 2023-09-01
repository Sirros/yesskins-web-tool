let url;

if (process.env.NODE_ENV == "development") {
  // 开发环境中
  url = "http://172.18.30.106:8082";
} else {
  // 生产环境中
  url = "http://172.18.30.106:8082";
}

export default {
  url,
};
