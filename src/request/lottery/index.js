import ajax from "../ajax.js";

// 更新奖池
const updatePrice = (data) => {
  return ajax({
    method: "POST",
    url: "/lottery/updatePrice",
    data,
  });
};

// 删除奖池
const deletePrice = (data) => {
  return ajax({
    method: "POST",
    url: "/lottery/deletePrice",
    data,
  });
};

// 新增奖池
const addPrice = (data) => {
  return ajax({
    method: "POST",
    url: "/lottery/addPrice",
    data,
  });
};

// 获取奖池
const priceList = (params) => {
  return ajax({
    url: "/lottery/pricePool",
    params,
  });
};

// 发送奖品
const sendPrize = (data) => {
  return ajax({
    method: "POST",
    url: "/lottery/sendPrice",
    data,
  });
};

export default {
  updatePrice,
  deletePrice,
  addPrice,
  priceList,
  sendPrize,
};
