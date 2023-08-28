import ajax from "../ajax.js";

// get请求
const login = (params) => {
  return ajax({
    url: "/xxx",
    params,
  });
};

// post请求
const register = (data) => {
  return ajax({
    method: "POST",
    url: "/xxx",
    data,
  });
};

// get请求
// const login = (params) => {
//   return ajax({
//     url: "/xxx",
//     params,
//   });
// };

export default {
  login,
  register,
};
