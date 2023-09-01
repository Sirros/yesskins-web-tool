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
      <span class="blod" v-loading="txtLoading">xxxx&nbsp;</span>元

      <div class="mt20">
        <el-button
          :loading="btnLoading"
          type="primary"
          :disabled="applyDisabled"
          @click="handleDoSendEmail"
          >申请返利</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "RechargeRecords",
  components: {},
  data() {
    return {
      applyDisabled: true,
      txtLoading: false,
      btnLoading: false,

      // activeIndex: "1",
    };
  },
  created() {
    this.handleGetData();
  },
  methods: {
    // 请求流水
    handleGetData() {
      const user = localStorage.getItem("user");
      if (!user) return;
      this.$api
        .getTopUp({ userId: user.userId })
        .then((res) => {
          console.log("===获取流水===", res);
          this.$message({
            message: "登陆成功",
            type: "success",
          });
        })
        .catch((e) => {
          console.log("登录失败，请重试", e);
        });
    },

    // 申请返现
    handleDoSendEmail() {
      const EMAIL = "121970263@qq.com";
      this.$api
        .sendEmail({ email: EMAIL })
        .then((res) => {
          console.log("===申请返利===", res);
          this.$message({
            message: "申请成功",
            type: "success",
          });
        })
        .catch((e) => {
          console.log("登录失败，请重试", e);
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
