<template>
  <div id="app">
    <div v-if="!isLoginPage" class="tips-txt">
      xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
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
};
</script>

<style lang="scss">
.tips-txt {
  width: 100%;
  height: 56px;
  border-bottom: 1px solid #eee;
  line-height: 56px;
  text-align: center;
}
</style>
