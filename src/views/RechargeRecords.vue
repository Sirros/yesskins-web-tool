<template>
  <div class="records">
    <!-- <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
    >
      <el-menu-item index="1">流水</el-menu-item>
      <el-menu-item index="2" disabled>抽奖</el-menu-item>
    </el-menu> -->

    <div class="mt20">
      <span>近7天充值总金额：</span>
      <span class="blod" v-loading="txtLoading">{{ money || "0" }}&nbsp;</span
      >元

      <div class="mt20 mb20">
        <el-button
          type="primary"
          :disabled="!money"
          @click="handleDoSendEmail"
          :loading="btnLoading"
          >申请返利</el-button
        >
      </div>

      <el-alert
        style="width: 30%; margin: auto"
        class="mt20"
        title="注意：申请返利时间间隔为 1 小时"
        type="info"
      >
      </el-alert>
    </div>
  </div>
</template>

<script>
import { Local } from "@/utils/storage";
export default {
  name: "RechargeRecords",
  components: {},
  data() {
    return {
      applyDisabled: true,
      txtLoading: false,
      btnLoading: false,
      money: "0",

      // activeIndex: "1",
    };
  },
  created() {
    this.handleGetData();
  },
  methods: {
    // 请求流水
    handleGetData() {
      const user = Local.get("user");
      if (!user) return;
      this.txtLoading = true;
      this.$api
        .getTopUp(/*{ userId: user.userId }*/)
        .then((res) => {
          console.log("===获取流水===", res);
          if (res?.data && res?.data?.code === 200) {
            this.money = res?.data?.data?.totalTopUp;
          } else {
            this.$message({
              message: res?.data?.message || "获取流水失败，请重试",
              type: "warning",
            });
          }
          this.txtLoading = false;
        })
        .catch((e) => {
          console.log("获取流水失败，请重试", e);
          this.$message({
            message: "获取流水失败，请重试",
            type: "warning",
          });
        });
    },

    // 申请返现
    handleDoSendEmail() {
      // const EMAIL = "121970263@qq.com";
      this.btnLoading = true;
      this.$api
        .sendEmail(/*{ email: EMAIL }*/)
        .then((res) => {
          console.log("===申请返利===", res);
          if (res?.data && res?.data?.code === 200) {
            this.$message({
              message: "申请成功",
              type: "success",
            });
            this.handleGetData();
          } else {
            this.$message({
              message: res?.data?.message || "请求异常，请联系管理员",
              type: "warning",
            });
          }
          this.btnLoading = false;
        })
        .catch((e) => {
          this.$message({
            message: "请求异常，请联系管理员",
            type: "warning",
          });
          console.log("请求失败，请重试", e);
        });
    },

    // handleSelect(val) {
    //   console.log(val);
    // },
  },
};
</script>

<style lang="scss" scoped>
.records {
  text-align: center;
}
</style>
