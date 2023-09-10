<template>
  <div class="records">
    <el-menu
      v-if="!isAdmin"
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
    >
      <el-menu-item index="1">流水</el-menu-item>
      <el-menu-item index="2">免费抽奖</el-menu-item>
      <el-menu-item index="3">付费抽奖</el-menu-item>
    </el-menu>

    <el-button
      style="position: absolute; right: 10px; top: 10px"
      @click="handleLogout"
      >退出登录</el-button
    >

    <el-alert
      v-if="activeIndex == '1'"
      style="width: 30%; margin: auto"
      class="mt20"
      title="注意：申请返利时间间隔为 1 小时"
      type="info"
    >
    </el-alert>

    <div class="mt20" v-if="!isAdmin && activeIndex == '1'">
      <span>近7天充值总金额：</span>
      <span class="blod" v-loading="txtLoading"
        >$ {{ money || "0" }}&nbsp;</span
      >

      <div class="mt20 mb20">
        <el-button
          type="primary"
          :disabled="!money"
          @click="handleDoSendEmail"
          :loading="btnLoading"
          >申请返利</el-button
        >

        <el-button
          v-if="refreshBtnShow"
          type="plain"
          :loading="txtLoading"
          @click="handleGetData"
          >刷新</el-button
        >
      </div>

      <div>
        <el-divider></el-divider>
        <span> 剩余积分：{{ integral }} </span>
        <el-button
          class="ml15"
          type="plain"
          :loading="txtLoading"
          @click="handleRedemption"
          >积分兑换</el-button
        >
      </div>

      <div class="bg-box">
        <img src="@/assets/homebg.jpg" alt="" />
      </div>
    </div>

    <!-- <div v-if="isAdmin">
      <el-table
        v-loading="tableLoading"
        :data="userList"
        border
        style="width: 40%; margin: auto; margin-top: 30px"
      >
        <el-table-column fixed prop="userId" label="用户ID"> </el-table-column>
        <el-table-column prop="password" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="handleEdit(scope)"
              >编辑</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div> -->

    <!-- 修改密码 dialog -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item v-if="isEditPswd" label="用户ID" label-width="70">
          <el-input v-model="form.editUserId" disabled></el-input>
        </el-form-item>
        <el-form-item v-if="isEditPswd" label="新密码" label-width="70">
          <el-input v-model="form.editPassword"></el-input>
        </el-form-item>
        <el-form-item v-if="!isEditPswd" label="兑换积分" label-width="70">
          <el-input v-model="form.integral"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCloseDialog">取 消</el-button>
        <el-button type="primary" @click="handleUpdatePswd">确 定</el-button>
      </div>
    </el-dialog>

    <CustomRoll
      v-if="activeIndex == 2"
      :ref="`${activeIndex}Ref`"
      rollType="free"
    />

    <CustomRoll
      v-if="activeIndex == 3"
      :ref="`${activeIndex}Ref`"
      rollType="pay"
    />
  </div>
</template>

<script>
import CustomRoll from "./CustomRoll.vue";
import { Local } from "@/utils/storage";
export default {
  name: "RechargeRecords",
  components: { CustomRoll },
  data() {
    return {
      applyDisabled: true,
      txtLoading: false,
      btnLoading: false,
      refreshBtnShow: false,
      money: "0",
      user: null,

      // tableLoading: false,
      // userList: [],

      isEditPswd: false,
      dialogTitle: "修改密码",
      dialogFormVisible: false,
      form: {
        editUserId: "",
        editPassword: "",
        integral: "",
      },

      activeIndex: "1",

      integral: 99999, // 积分
    };
  },
  computed: {
    isAdmin() {
      console.log(this.user);
      if (!this.user) return false;
      if (this.user && this.user?.isAdmin) {
        return true;
      }
      return false;
    },
  },
  created() {
    // const user = Local.get("user");
    // this.user = user;
    // if (user?.isAdmin) {
    //   this.handleGetUserList();
    // } else {
    //   this.handleGetData();
    // }
  },
  methods: {
    // 退出登录
    handleLogout() {
      const user = Local.get("user");
      console.log(user, "【【退出登录】】");
      if (!user) return;
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
          console.log("::获取流水响应::", res);
          if (res?.data && res?.data?.code === 200) {
            this.money = res?.data?.data?.totalTopUp;
          } else {
            this.$message({
              message: res?.data?.message || "获取流水失败，请三分钟后重试",
              type: "warning",
            });
            this.refreshBtnShow = true;
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

    // 申请返现
    handleDoSendEmail() {
      this.btnLoading = true;
      this.$api
        .sendEmail()
        .then((res) => {
          console.log("::申请返利响应::", res);
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

    // 编辑
    // handleEdit(scope) {
    //   this.form.editUserId = scope.row.userId;
    //   this.isEditPswd = true;
    //   this.dialogFormVisible = true;
    // },

    // 积分兑换
    handleRedemption() {
      this.dialogTitle = "积分兑换";
      this.dialogFormVisible = true;
    },

    handleCloseDialog() {
      this.isEditPswd = false;
      this.dialogFormVisible = false;
      this.form.editUserId = "";
      this.form.editPassword = "";
    },

    handleSubmit() {
      if (this.isEditPswd) {
        this.handleUpdatePswd();
        console.log("==修改密码==");
      } else {
        this.handleGetIntegral();
        console.log("==兑换积分==");
      }
    },

    // 更新密码请求
    handleUpdatePswd() {
      this.$api
        .updatePswd({
          userId: this.form.editUserId,
          password: this.form.editPassword,
        })
        .then((res) => {
          console.log("::更新密码请求相应::", res);
          if (res?.data && res?.data?.code === 200) {
            this.$message({
              message: "更新密码成功",
              type: "success",
            });
            this.handleCloseDialog();
          } else {
            this.$message({
              message: res?.data?.message || "更新密码请求异常，请联系管理员",
              type: "warning",
            });
          }
        })
        .catch((e) => {
          this.$message({
            message: "更新密码请求异常，请联系管理员",
            type: "warning",
          });
          console.error("更新密码请求失败，请重试", e);
        });
    },

    // 兑换积分请求
    handleGetIntegral() {},

    // 获取用户列表
    handleGetUserList() {
      this.tableLoading = true;
      this.$api
        .getUserList()
        .then((res) => {
          console.log(":::获取用户列表响应:::", res);
          if (res?.data && res?.data?.code === 200) {
            this.userList = res.data.data;
          } else {
            this.$message({
              message:
                res?.data?.message || "获取用户列表请求异常，请联系管理员",
              type: "warning",
            });
          }
        })
        .catch((e) => {
          this.$message({
            message: "获取用户列表请求异常，请联系管理员",
            type: "warning",
          });
          console.error("获取用户列表请求失败，请重试", e);
        })
        .finally(() => {
          this.tableLoading = false;
        });
    },

    // 菜单选择
    handleSelect(val) {
      const ref = `${this.activeIndex}Ref`;
      this.$refs?.[ref]?.handleSetTimer(null);
      this.$nextTick(() => {
        this.activeIndex = val;
      });
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
</style>
