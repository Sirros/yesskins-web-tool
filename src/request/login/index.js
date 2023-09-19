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

// 获取用户详情
const detail = (params) => {
  return ajax({
    url: "/userService/userDetail",
    params,
  });
};

export default {
  login,
  register,
  logout,
  detail,
};
