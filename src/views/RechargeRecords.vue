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

    <div class="mt20" v-if="!isAdmin">
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

    <div v-else>
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
    </div>

    <el-dialog title="修改密码" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="用户ID" label-width="70">
          <el-input v-model="form.editUserId" disabled></el-input>
        </el-form-item>
        <el-form-item label="新密码" label-width="70">
          <el-input v-model="form.editPassword"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCloseDialog">取 消</el-button>
        <el-button type="primary" @click="handleUpdatePswd">确 定</el-button>
      </div>
    </el-dialog>
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
      tableLoading: false,
      money: "0",
      user: null,
      userList: [],

      dialogFormVisible: false,
      form: {
        editUserId: "",
        editPassword: "",
      },

      // activeIndex: "1",
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
    const user = Local.get("user");
    this.user = user;

    if (user?.isAdmin) {
      this.handleGetUserList();
    } else {
      this.handleGetData();
    }
  },
  methods: {
    // 请求流水
    handleGetData() {
      if (!this.user) return;
      this.txtLoading = true;
      this.$api
        .getTopUp()
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
        })
        .catch((e) => {
          this.$message({
            message: "请求异常，请联系管理员",
            type: "warning",
          });
          console.log("请求失败，请重试", e);
        })
        .finally(() => {
          this.btnLoading = false;
        });
    },

    handleEdit(scope) {
      this.form.editUserId = scope.row.userId;
      this.dialogFormVisible = true;
    },

    handleCloseDialog() {
      this.dialogFormVisible = false;
      this.form.editUserId = "";
      this.form.editPassword = "";
    },

    handleUpdatePswd() {
      this.$api
        .updatePswd({
          userId: this.form.editUserId,
          password: this.form.editPassword,
        })
        .then((res) => {
          console.log("===更新密码===", res);
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
          console.log("更新密码请求失败，请重试", e);
        });
    },

    handleGetUserList() {
      this.tableLoading = true;
      this.$api
        .getUserList()
        .then((res) => {
          console.log("===获取用户列表===", res);
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
          console.log("获取用户列表请求失败，请重试", e);
        })
        .finally(() => {
          this.tableLoading = false;
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
