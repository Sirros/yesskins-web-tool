let url;

if (process.env.NODE_ENV == "development") {
  // 开发环境中
  url = "http://192.168.1.6:8002";
} else {
  // 生产环境中
  url = "http://127.0.0.1:8002";
}

export default {
  url,
};
