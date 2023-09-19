import ajax from "../ajax.js";

// post请求
// 流水兑换积分
const exchangePoints = (data) => {
  return ajax({
    method: "POST",
    url: "/points/exchange",
    data,
  });
};

// 积分兑换抽奖次数
const exchangeTime = (data) => {
  return ajax({
    method: "POST",
    url: "/points/exchange/lottery",
    data,
  });
};

export default {
  exchangePoints,
  exchangeTime,
};
