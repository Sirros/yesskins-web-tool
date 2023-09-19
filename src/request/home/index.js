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
    url: "/userService/modifyUserFreeLottery",
    data,
  });
};

// 设置  兑换多少积分 可以换一次 免费抽奖次数 以及 抽一次付费将 要多少积分
const settingGlobalPoint = (data) => {
  return ajax({
    method: "POST",
    url: "/userService/modifyAdminConfig",
    data,
  });
};

const getGlobalSetting = (params) => {
  console.log(params);
  return ajax({
    url: "/userService/getAdminConfig",
    params,
  });
};

export default {
  getTopUp,
  sendEmail,
  getUserList,
  updatePswd,
  updateFreeRollCount,
  settingGlobalPoint,
  getGlobalSetting,
};
