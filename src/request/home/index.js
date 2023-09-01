import ajax from "../ajax.js";

// get请求
const getTopUp = (params) => {
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

export default {
  getTopUp,
  sendEmail,
};
