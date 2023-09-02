import Axios from "axios";
// import router from "../router";

// 引入提示框
// import { MessageBox } from "element-ui";
// import { Message } from "element-ui";

const axios = Axios.create({
  timeout: 150000, // request timeout
});

// let showMsg = true; //阻止错误多次弹窗

// 添加请求拦截器  作用是在请求发送前进行一些操作
// axios.interceptors.request.use(
//   function (config) {
//     let configurl = config.url;
//     // 获取存储token中的值
//     let userinfo = JSON.parse(localStorage.getItem("userInfo")) || "";
//     // 如果有用户信息，就在请求前加token，我这里是接口返回两个token，所以判断了一下对应的接口加对应的token
//     if (userinfo) {
//       let tokens = userinfo.cli_user.token;
//       let xcxtoken = userinfo.wx_user.token;
//       // 在发送请求之前做些什么
//       if (tokens && typeof tokens === "string") {
//         if (configurl.indexOf("/api_wx") != -1) {
//           config.headers.Authorization = "Bearer " + xcxtoken;
//         } else {
//           config.headers.Authorization = "Bearer " + tokens;
//         }
//       }
//     }
//     // 如果一个token，直接使用这个
//     // let userinfo = JSON.parse(localStorage.getItem('userInfo')) || ''
//     // let tokens = userinfo.token
//     // 在发送请求之前做些什么
//     // if (tokens && typeof tokens === 'string') {
//     // config.headers.token = tokens;
//     // }
//     return config;
//   },
//   function (error) {
//     // 抛出错误
//     Message.error("请求中错误:" + error);
//     // 对请求错误做些什么
//     return Promise.reject(error);
//   }
// );

// // 添加响应拦截器  作用是在接收到响应后进行一些操作
// axios.interceptors.response.use(
//   function (response) {
//     // 对响应数据做点什么
//     if (response.status == 200) {
//       if (response.data.code != 0) {
//         //阻止弹窗多次弹出
//         if (showMsg) {
//           MessageBox.alert(response.data.msg, "错误", {
//             confirmButtonText: "确定",
//             type: "error",
//           }).then(() => {
//             if (response.data.code == 401) {
//               localStorage.removeItem("userInfo");
//               router.replace("/login");
//             }
//           });
//           showMsg = false;
//           setTimeout(() => {
//             showMsg = true;
//           }, 3000);
//         }
//       }
//     } else {
//       // 获取成功后的错误提示
//       MessageBox.alert("系统错误", "错误", {
//         confirmButtonText: "确定",
//         type: "error",
//       });
//     }

//     return response;
//   },
//   function (error) {
//     // 在这里还可以进行响应码的判断
//     // switch (error.response.status) {
//     //	  case 400:
//     //	  	error.message = '错误请求'
//     //	  break;
//     //	  case 500:
//     // 	 	error.message = '服务器端出错'
//     //      break;
//     // }
//     // 抛出错误提示
//     MessageBox.alert(error, "错误", {
//       confirmButtonText: "确定",
//       type: "error",
//     });
//     // 对响应错误做点什么
//     return Promise.reject(error);
//   }
// );
export default axios;
