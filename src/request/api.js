//  登陆
import login from "./login/index";
import register from "./login/index";
import logout from "./login/index";
import getTopUp from "./home/index";

// 主页
export default {
  ...login,
  ...register,
  ...logout,
  ...getTopUp,
};
