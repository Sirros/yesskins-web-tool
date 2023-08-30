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
      // activeIndex: "1",

      applyDisabled: true,
      txtLoading: false,
      btnLoading: false,
    };
  },
  created() {
    this.handleApply();
  },
  methods: {
    // handleSelect(val) {
    //   console.log(val);
    // },
    handleApply() {
      this.$message({
        message: "恭喜你，这是一条成功消息",
        type: "success",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.records {
  text-align: center;
}
</style>
