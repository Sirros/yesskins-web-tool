<template>
  <div id="app">
    <div v-if="!isLoginPage" class="tips-txt">
      <!-- <span>xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</span> -->
      <el-button
        style="position: absolute; right: 10px; top: 8px"
        @click="handleLogout"
        >退出登录</el-button
      >
    </div>
    <router-view />
  </div>
</template>
<script>
export default {
  computed: {
    isLoginPage() {
      return this.$route.path === "/login";
    },
  },
  methods: {
    // 退出登录
    handleLogout() {
      const user = window.localStorage.getItem("user");
      if (!user) return;
      this.$api
        .logout({ userId: user.userId })
        .then(() => {
          localStorage.setItem("user", null);
          this.$message({
            message: "退出登录成功",
            type: "success",
          });
        })
        .catch();
    },
  },
};
</script>

<style lang="scss">
.tips-txt {
  width: 100%;
  height: 56px;
  border-bottom: 1px solid #eee;
  line-height: 56px;
  text-align: center;
  position: relative;
}
</style>
