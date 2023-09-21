//  登陆
import login from "./login/index";
import register from "./login/index";
import logout from "./login/index";
import detail from "./login/index";

import getTopUp from "./home/index";
import sendEmail from "./home/index";
import getUserList from "./home/index";
import updatePswd from "./home/index";
import updateFreeRollCount from "./home/index";
import userUpdateFreeRollCountUser from "./home/index";
import settingGlobalPoint from "./home/index";
import getGlobalSetting from "./home/index";

import updatePrice from "./lottery/index";
import deletePrice from "./lottery/index";
import addPrice from "./lottery/index";
import priceList from "./lottery/index";
import sendPrize from "./lottery/index";

import exchangePoints from "./points/index";
import exchangeTime from "./points/index";

// 主页
export default {
  ...login,
  ...register,
  ...logout,
  ...detail,

  ...getTopUp,
  ...sendEmail,
  ...getUserList,
  ...updatePswd,
  ...updateFreeRollCount,
  ...userUpdateFreeRollCountUser,
  ...settingGlobalPoint,
  ...getGlobalSetting,

  ...updatePrice,
  ...deletePrice,
  ...addPrice,
  ...priceList,
  ...sendPrize,

  ...exchangePoints,
  ...exchangeTime,
};
