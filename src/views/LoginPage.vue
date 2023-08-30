<template>
  <div class="login">
    <div class="form-area pd20">
      <el-form ref="form" :model="form" :rules="rules" label-width="60px">
        <el-form-item prop="usrName">
          <span class="fff" slot="label">账号:</span>
          <el-input v-model="form.usrName" clearable></el-input>
        </el-form-item>
        <el-form-item prop="usrPswd">
          <span class="fff" slot="label">密码:</span>
          <el-input v-model="form.usrPswd" show-password clearable></el-input>
        </el-form-item>
        <div class="footer">
          <el-button @click="handleRegister" type="info" plain>注册</el-button>
          <el-button type="primary" @click="handleLogin" :loading="btnLoading"
            >确定</el-button
          >
        </div>
      </el-form>
    </div>

    <el-dialog
      v-if="dialogVisible"
      title="注册"
      width="30%  "
      :visible.sync="dialogVisible"
      :before-close="handleCloseDialog"
    >
      <el-form
        ref="registerForm"
        :model="registerForm"
        :rules="registerRules"
        label-width="90px"
      >
        <el-form-item prop="name">
          <span slot="label">账号:</span>
          <el-input v-model="registerForm.name" clearable></el-input>
        </el-form-item>
        <el-form-item prop="pswd">
          <span slot="label">密码:</span>
          <el-input
            v-model="registerForm.pswd"
            show-password
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item prop="rept">
          <span slot="label">重复密码:</span>
          <el-input
            v-model="registerForm.rept"
            show-password
            clearable
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCloseDialog">取 消</el-button>
        <el-button type="primary" @click="handleRegisterSubmit"
          >提 交</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "LoginPage",
  components: {},
  data() {
    const validatePswRepeat = (rule, value, callback) => {
      if (!value) callback(new Error("请重复密码"));
      if (value != this.registerForm.pswd) {
        callback(new Error("密码不一致，请重试"));
      } else {
        callback();
      }
    };
    return {
      dialogVisible: false,
      btnLoading: false,
      form: {
        usrName: "",
        usrPswd: "",
      },
      rules: {
        usrName: [{ required: true, message: "请输入账号", trigger: "change" }],
        usrPswd: [{ required: true, message: "请输入密码", trigger: "change" }],
      },

      registerForm: {
        name: "",
        pswd: "",
        rept: "",
      },
      registerRules: {
        name: [{ required: true, message: "请输入账号", trigger: "change" }],
        pswd: [{ required: true, message: "请输入密码", trigger: "change" }],
        rept: [
          { required: true, trigger: "change", validator: validatePswRepeat },
        ],
      },
    };
  },
  methods: {
    handleLogin() {
      this.loading = true;
      this.$refs.form.validate((valid) => {
        if (valid) {
          // TODO:
          // this.$api.login(...form)
          // .then(() => {
          //  window.userInfo = {}
          // })
          // .catch()
          localStorage.setItem("user", { isLogin: true });
          this.$router.push("/");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleRegister() {
      this.dialogVisible = true;
    },
    handleCloseDialog() {
      this.dialogVisible = false;
    },
    handleRegisterSubmit() {
      this.$refs.registerForm.validate((valid) => {
        if (valid) {
          console.log("--");
          // TODO:
          // this.$api.register(...form)
          // .then(() => {
          //  window.userInfo = {}
          // })
          // .catch()
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // handleSelect(val) {
    //   console.log(val);
    // },
  },
};
</script>

<style lang="scss">
.login {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url("../assets/bg2.jpg");
  background-position: center;
  background-repeat: no-repeat;
  background-size: auto auto;
}

.form-area {
  width: 400px;
  position: relative;
  top: 80%;
  left: 50%;
  transform: translate(-50%, -50%);
  // border: 1px solid #eee;
  border-radius: 2px;

  .footer {
    text-align: right;
  }
}
</style>
