<template>
  <div class="records">
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
    >
      <el-menu-item v-if="!isAdmin" index="money">流水</el-menu-item>
      <el-menu-item v-if="!isAdmin" index="freeRoll">免费抽奖</el-menu-item>
      <el-menu-item v-if="!isAdmin" index="payRoll">付费抽奖</el-menu-item>
      <el-menu-item v-if="isAdmin" index="setting">抽奖设置</el-menu-item>
      <el-menu-item v-if="isAdmin" index="poolSetting">奖池设置</el-menu-item>
      <el-menu-item v-if="isAdmin" index="editPswd">修改密码</el-menu-item>
    </el-menu>

    <el-button
      style="position: absolute; right: 10px; top: 10px"
      @click="handleLogout"
      >退出登录</el-button
    >

    <div
      class="user-info"
      style="
        position: absolute;
        height: 60px;
        right: 140px;
        top: 0px;
        line-height: 60px;
      "
    >
      <span>用户ID：</span>
      <span class="mr30">{{ user.userId }}</span>

      <span>剩余积分：</span>
      <span class="blod">{{ integral.toLocaleString() }}</span>

      <el-button
        class="ml20"
        type="plain"
        @click="handleDoApply"
        :disabled="!canApply"
        >申请返利</el-button
      >
    </div>

    <el-alert
      v-if="activeIndex == 'money'"
      style="width: 30%; margin: auto"
      class="mt20"
      title="注意：申请返利时间间隔为 1 小时"
      type="info"
      :closable="false"
    >
    </el-alert>

    <div class="mt20" v-if="!isAdmin && activeIndex == 'money'">
      <span>近7天充值总金额：</span>
      <span class="blod" v-loading="txtLoading"
        >$ {{ money || "0" }}&nbsp;</span
      >

      <div class="mt20 mb20">
        <el-button type="primary" :disabled="!canExchange" @click="handleSubmit"
          >积分兑换</el-button
        >

        <el-button
          v-if="refreshBtnShow"
          type="plain"
          :loading="txtLoading"
          @click="handleGetData"
          >刷新</el-button
        >
      </div>

      <div class="user-info-mobile">
        <el-divider></el-divider>
        <span>用户ID：</span>
        <span class="mr30">{{ user.userId }}</span>

        <span> 剩余积分：</span>
        <span class="blod">{{ integral }} </span>

        <el-button
          class="ml15 mt20"
          type="plain"
          @click="handleDoApply"
          :disabled="!canApply"
          >申请返利</el-button
        >
      </div>

      <div class="bg-box">
        <img src="@/assets/homebg.jpg" alt="" />
      </div>
    </div>

    <!-- 兑换积分 dialog -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="返利积分" label-width="70">
          <el-input v-model="form.integral"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCloseDialog">取 消</el-button>
        <el-button
          type="primary"
          @click="handleDoSendEmail"
          :loading="btnLoading"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <CustomRoll
      v-if="['freeRoll', 'payRoll'].includes(activeIndex)"
      :ref="`${activeIndex}Ref`"
      :rollType="rollType"
    />

    <AdminSetting
      v-if="['setting', 'poolSetting', 'editPswd'].includes(activeIndex)"
      :menuTab="activeIndex"
    />
  </div>
</template>

<script>
import CustomRoll from "./CustomRoll.vue";
import AdminSetting from "./AdminSetting.vue";
import { Local } from "@/utils/storage";
export default {
  name: "RechargeRecords",
  components: { CustomRoll, AdminSetting },
  data() {
    return {
      applyDisabled: true,
      txtLoading: false,
      btnLoading: false,
      refreshBtnShow: false,
      money: "0",
      user: null,

      dialogTitle: "申请返利",
      dialogFormVisible: false,
      form: {
        integral: "",
      },

      activeIndex: "money",
      rollType: "free",
      integral: 0, // 积分
      startTime: "",
      endTime: "",

      canApply: false, // 可否申请返利
      canExchange: false, // 可否兑换积分
    };
  },
  computed: {
    isAdmin() {
      console.log("当前用户：", this.user);
      if (!this.user) return false;
      if (this.user && this.user?.isAdmin) {
        return true;
      }
      return false;
    },
  },
  created() {
    const user = Local.get("user");
    console.log(user, !user);
    if (!user) {
      return this.$router.push("/login");
    }
    this.user = user;
    if (user?.isAdmin) {
      this.activeIndex = "setting";
    } else {
      this.activeIndex = "money";
      this.handleGetData();
    }
  },
  methods: {
    // 退出登录
    handleLogout() {
      const user = Local.get("user");
      console.log(user, "【【退出登录】】");
      if (!user) {
        window.localStorage.removeItem("user");
        this.$router.push("/login");
        return;
      }
      this.$api
        .logout({ userId: user.userId })
        .then((res) => {
          if (res?.data && res?.data?.code === 200) {
            console.log("::退出登录响应::", res);
            Local.set("user", "");
            this.$message({
              message: "退出登录成功",
              type: "success",
            });
            this.$router.push("/login");
          }
        })
        .catch();
    },

    // 请求流水
    handleGetData() {
      if (!this.user) return;
      this.txtLoading = true;
      this.$api
        .getTopUp()
        .then((res) => {
          // console.log("::获取流水响应::", res);
          if (res?.data && res?.data?.code === 200) {
            this.money = res?.data?.data?.totalTopUp;
            this.startTime = res?.data?.data?.startTime;
            this.endTime = res?.data?.data?.endTime;
            this.canExchange = true;
            this.$nextTick(() => {
              this.handleGetDetail();
            });
          } else {
            this.$message({
              message: res?.data?.message || "获取流水失败，请三分钟后重试",
              type: "warning",
            });
            this.refreshBtnShow = true;
            this.canExchange = false;
          }
        })
        .catch((e) => {
          console.log("获取流水失败，请重试", e);
          this.$message({
            message: "获取流水失败，请重试",
            type: "warning",
          });
        })
        .finally(() => {
          this.txtLoading = false;
        });
    },

    // 申请返利 dialog
    handleDoApply() {
      this.dialogFormVisible = true;
    },
    // 申请返利
    handleDoSendEmail() {
      this.btnLoading = true;
      this.$api
        .sendEmail({
          totalTopUp: this.form.integral,
          startTime: this.startTime,
          endTime: this.endTime,
        })
        .then((res) => {
          if (res?.data && res?.data?.code === 200) {
            this.$message({
              message: "申请成功",
              type: "success",
            });
            this.handleGetData();
            this.dialogFormVisible = false;
          } else {
            this.$message({
              message: res?.data?.message || "请求异常，请联系管理员",
              type: "warning",
            });
          }
        })
        .catch((e) => {
          this.$message({
            message: "请求异常，请联系管理员",
            type: "warning",
          });
          console.error("请求失败，请重试", e);
        })
        .finally(() => {
          this.btnLoading = false;
        });
    },
    handleCloseDialog() {
      this.form.integral = "";
      this.dialogFormVisible = false;
    },

    handleGetDetail() {
      this.$api
        .detail()
        .then((res) => {
          if (res?.data && res?.data?.code === 200) {
            this.integral = res?.data?.data?.point;
            this.canApply = true;
          } else {
            this.$message({
              message: res?.data?.message || "获取详情，请三分钟后重试",
              type: "warning",
            });
            this.refreshBtnShow = true;
            this.canApply = false;
          }
        })
        .catch((e) => {
          console.log("获取详情，请重试", e);
          this.$message({
            message: "获取详情，请重试",
            type: "warning",
          });
        });
    },

    // 积分兑换提交
    handleSubmit() {
      if (this.money == "0" || this.txtLoading) return;
      this.$api
        .exchangePoints({
          totalTopUp: this.money,
          startTime: this.startTime,
          endTime: this.endTime,
        })
        .then((res) => {
          if (res?.data && res?.data?.code === 200) {
            this.$message({
              message: "积分兑换成功",
              type: "success",
            });
            this.handleGetDetail();
          } else {
            this.handleCodeNot200(res, "积分兑换");
          }
        })
        .catch((e) => this.handleRequestError(e));
    },

    // 菜单选择
    handleSelect(val) {
      this.rollType = val == "freeRoll" ? "free" : "pay";
      this.activeIndex = val;
    },
    // 辅助函数
    handleCodeNot200(res, type) {
      this.$message({
        message: res?.data?.message || type + "请求异常，请联系管理员",
        type: "warning",
      });
    },
    handleRequestError(e) {
      this.$message({
        message: "请求异常，请联系管理员",
        type: "warning",
      });
      console.error("请求失败，请重试", e);
    },
  },
};
</script>

<style lang="scss" scoped>
.records {
  text-align: center;
}

.bg-box {
  margin: 30px auto;
  width: 40%;
  img {
    width: 100%;
  }
}

.el-divider {
  width: 90%;
  margin: 24px auto;
}

.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-icon-arrow-down {
  font-size: 12px;
}
</style>
