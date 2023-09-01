import ajax from "../ajax.js";

// post请求
const login = (data) => {
  return ajax({
    method: "POST",
    url: "/userService/login",
    data,
  });
};

const register = (data) => {
  return ajax({
    method: "POST",
    url: "/userService/signup",
    data,
  });
};

const logout = (data) => {
  return ajax({
    method: "POST",
    url: "/userService/logout",
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
  logout,
};
