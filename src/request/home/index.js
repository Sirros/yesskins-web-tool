import ajax from "../ajax.js";

// 获取流水
const getTopUp = (params) => {
  console.log(params);
  return ajax({
    url: "/topup/list", // userId = xxxx
    params,
  });
};

// 发送邮件
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

// 更新免费抽奖次数
const updateFreeRollCount = (data) => {
  return ajax({
    method: "POST",
    url: "/xxxxx",
    data,
  });
};

// 获取奖池列表
const getGoodsPool = (params) => {
  return ajax({
    url: "/xxxxx",
    params,
  });
};

// 设置奖池，单个设置
const setGoodsPool = (data) => {
  return ajax({
    method: "POST",
    url: "/xxxxx",
    data,
  });
};

// 兑换积分
const updatePoint = (data) => {
  return ajax({
    method: "POST",
    url: "/xxxxx",
    data,
  });
};

export default {
  getTopUp,
  sendEmail,
  getUserList,
  updatePswd,
  updateFreeRollCount,
  getGoodsPool,
  setGoodsPool,
  updatePoint,
};
