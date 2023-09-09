import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "./assets/style/global.css"; // 完整加载
import VueLuckyCanvas from "@lucky-canvas/vue";
Vue.use(VueLuckyCanvas);
// 挂载全局api
import api from "./request/api";
Vue.prototype.$api = api;

Vue.config.productionTip = false;
Vue.use(ElementUI);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
