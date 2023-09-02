import ajax from "../ajax.js";

// get请求
const getTopUp = (params) => {
  console.log(params);
  return ajax({
    url: "/topup/list", // userId = xxxx
    params,
  });
};

// get请求
const sendEmail = (data) => {
  return ajax({
    method: "POST",
    url: "/topup/rebate",
    data,
  });
};

// 获取用户列表
const getUserList = (params) => {
  console.log(params);
  return ajax({
    url: "/userService/userList",
    params,
  });
};

// 更新密码
const updatePswd = (data) => {
  return ajax({
    method: "POST",
    url: "/userService/modifyUserPwd",
    data,
  });
};

export default {
  getTopUp,
  sendEmail,
  getUserList,
  updatePswd,
};
