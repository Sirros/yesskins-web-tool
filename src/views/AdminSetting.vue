<template>
  <div class="admin-setting">
    <el-radio-group
      class="mt20"
      v-if="['setting', 'poolSetting'].includes(menuTab)"
      v-model="poolType"
      @change="handlePoolTypeChange"
    >
      <el-radio-button label="免费奖池"></el-radio-button>
      <el-radio-button label="付费奖池"></el-radio-button>
    </el-radio-group>

    <!-- 抽奖设置 -->
    <div v-if="menuTab === 'setting'">
      <div v-if="poolType === '免费奖池'">
        <el-table
          :data="userList"
          border
          style="width: 40%; margin: auto; margin-top: 30px"
        >
          <el-table-column fixed prop="userId" label="用户ID">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="handleEdit(scope)"
                >编辑</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-else>
        <el-table
          :data="userList"
          border
          style="width: 40%; margin: auto; margin-top: 30px"
        >
          <el-table-column fixed prop="userId" label="用户ID">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="handleEdit(scope)"
                >编辑</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 奖池设置 -->
    <div v-if="menuTab === 'poolSetting'">
      <ul class="pool-list">
        <li v-for="(good, idx) in showList" :key="idx">
          <div class="content">
            <div class="operate">
              <span>奖品名称：</span>
              <el-input
                class="w200 mr20"
                v-model="good.name"
                placeholder="请输入"
                :disabled="idx !== editIdx"
              ></el-input>

              <span>奖品：</span>
              <el-image class="w200 mr20" :src="good.src"></el-image>
              <el-image
                v-if="editFile !== null && editIdx === idx"
                class="w200 mr20"
                src="https://100px.net/assets/img/1.23e4196d.svg"
              ></el-image>
              <el-upload
                class="mr20"
                action=""
                :auto-upload="false"
                :show-file-list="false"
                :on-change="handleUploadChange"
                :limit="1"
              >
                <el-button
                  size="small"
                  type="primary"
                  :disabled="idx !== editIdx"
                  >修改奖品图片</el-button
                >
              </el-upload>

              <span>中奖概率：</span>
              <el-input
                class="w100 mr20"
                v-model="good.rate"
                placeholder="请输入"
                :disabled="idx !== editIdx"
              ></el-input>
            </div>

            <div>
              <el-button v-if="editIdx === idx" @click="handlePoolEditCancel"
                >取消编辑</el-button
              >
              <el-button
                v-if="editIdx === idx"
                @click="handleSubmitEditPool(good)"
                >提交</el-button
              >
              <el-button v-else @click="handlePoolEditClick(idx)"
                >编辑</el-button
              >
            </div>
          </div>

          <el-divider></el-divider>
        </li>
        <li>
          <el-button plain>新增奖品</el-button>
        </li>
      </ul>
      <el-button type="primary">提交</el-button>
    </div>

    <!-- 修改密码 table -->
    <div v-if="menuTab === 'editPswd'">
      <el-table
        v-loading="tableLoading"
        :data="userList"
        border
        style="width: 40%; margin: auto; margin-top: 30px"
      >
        <el-table-column fixed prop="userId" label="用户ID"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="handleEdit(scope)"
              >编辑</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 修改密码 dialog -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
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
  props: {
    menuTab: {
      type: [String, Number],
      default: "setting",
    },
  },
  data() {
    return {
      poolType: "免费奖池",
      tableLoading: false,
      user: null,
      userList: [],

      // 奖池设置相关
      freePoolGoods: [], // 免费
      payPoolGoods: [], // 付费
      showList: [],
      editIdx: -1,
      editFile: null,

      // 修改密码相关
      dialogTitle: "修改密码",
      dialogFormVisible: false,
      form: {
        editUserId: "",
        editPassword: "",
      },
    };
  },
  // watch: {
  //   menuTab: {
  //     handler(n, o) {
  //       console.log(n, o);
  //     },
  //   },
  // },
  created() {
    const user = Local.get("user");
    console.log("====", user);
    this.user = user;
    this.handleGetUserList();
    this.handleGetPool();
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
    // 编辑
    handleEdit(scope) {
      this.form.editUserId = scope.row.userId;
      this.dialogFormVisible = true;
    },

    handleCloseDialog() {
      this.dialogFormVisible = false;
      this.form.editUserId = "";
      this.form.editPassword = "";
    },

    handleSubmit() {
      this.handleUpdatePswd();
      console.log("==修改密码==");
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

    // 获取用户列表
    handleGetUserList() {
      this.tableLoading = true;
      // this.$api
      //   .getUserList()
      //   .then((res) => {
      //     console.log(":::获取用户列表响应:::", res);
      //     if (res?.data && res?.data?.code === 200) {
      //       this.userList = res.data.data;
      //     } else {
      //       this.$message({
      //         message:
      //           res?.data?.message || "获取用户列表请求异常，请联系管理员",
      //         type: "warning",
      //       });
      //     }
      //   })
      //   .catch((e) => {
      //     this.$message({
      //       message: "获取用户列表请求异常，请联系管理员",
      //       type: "warning",
      //     });
      //     console.error("获取用户列表请求失败，请重试", e);
      //   })
      //   .finally(() => {
      //     this.tableLoading = false;
      //   });

      setTimeout(() => {
        this.userList = [
          { userId: 1 },
          { userId: 2 },
          { userId: 3 },
          { userId: 4 },
        ];
        this.tableLoading = false;
      }, 2000);
    },

    // 获取奖池列表
    handleGetPool() {
      this.freePoolGoods = [
        {
          name: 14123,
          src: "https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg",
          rate: 0.2,
          disabled: true,
        },
        {
          name: 12233,
          src: "https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg",
          rate: 0.2,
          disabled: false,
        },
        {
          name: 14123,
          src: "https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg",
          rate: 0.2,
          disabled: false,
        },
        {
          name: 121323,
          src: "https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg",
          rate: 0.2,
          disabled: false,
        },
        {
          name: 141223,
          src: "https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg",
          rate: 0.2,
          disabled: false,
        },
        {
          name: 122133,
          src: "https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg",
          rate: 0.2,
          disabled: false,
        },
      ];
      this.payPoolGoods = [
        {
          name: 9914123,
          src: "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
          rate: 0.1,
          disabled: false,
        },
        {
          name: 9912233,
          src: "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
          rate: 0.1,
          disabled: false,
        },
        {
          name: 9914123,
          src: "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
          rate: 0.1,
          disabled: false,
        },
        {
          name: 99121323,
          src: "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
          rate: 0.1,
          disabled: false,
        },
        {
          name: 99141223,
          src: "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
          rate: 0.1,
          disabled: false,
        },
        {
          name: 99122133,
          src: "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
          rate: 0.1,
          disabled: false,
        },
      ];
      this.showList = this.freePoolGoods;
    },

    // 图片上传
    handleUploadChange(data) {
      console.log(data);
      this.editFile = data;
    },

    handlePoolEditClick(idx) {
      this.editIdx = idx;
    },

    handlePoolEditCancel() {
      this.editFile = null;
      this.editIdx = -1;
    },

    handleSubmitEditPool(item) {
      console.log(item);
    },

    handlePoolTypeChange(val) {
      if (val === "付费奖池") {
        this.showList = this.payPoolGoods;
      } else {
        this.showList = this.freePoolGoods;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.admin-setting {
  width: 100%;
  height: 100%;
}

.pool-list {
  width: 80%;
  margin: 20px auto;
  border: 1px solid #eee;
  padding: 20px;

  li {
    list-style-type: none;
    margin-bottom: 10px;
    display: flex;
    flex-direction: column;
  }

  .content {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .operate {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}

.w200 {
  width: 200px !important;
}

.w100 {
  width: 100px !important;
}
</style>
