<template>
  <div class="admin-setting" v-loading="pageLoading">
    <el-radio-group
      class="mt20"
      v-if="['poolSetting'].includes(menuTab)"
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
            <template slot-scope="scope">
              <span>{{ scope.row.userId }}</span>
            </template>
          </el-table-column>
          <el-table-column
            fixed
            prop="numberOfFreeLottery"
            label="免费抽奖次数"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.numberOfFreeLottery || 0 }}</span>
            </template>
          </el-table-column>
          <el-table-column fixed prop="point" label="积分">
            <template slot-scope="scope">
              <span>{{ scope.row.point || 0 }}</span>
            </template></el-table-column
          >
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="handleEditRollCount(scope)"
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
              <el-button type="text" size="small" @click="handleEditPswd(scope)"
                >编辑</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 奖池设置 -->
    <div v-if="menuTab === 'poolSetting'">
      <div
        v-if="poolType !== '免费奖池'"
        class="flex-row mt20"
        style="justify-content: center"
      >
        <span style="margin-right: 10px"> 单次抽奖所需积分 </span>
        <el-input
          v-model="oneRollPoint"
          style="width: 200px; margin-right: 10px"
          type="number"
          placeholder="单次抽奖积分"
        ></el-input>
        <el-button
          @click="handleChangeRollPoint('LOTTERY_POINT', 'oneRollPoint')"
          >提交</el-button
        >
      </div>
      <div v-else class="flex-row mt20" style="justify-content: center">
        <span style="margin-right: 10px"> 兑换积分门槛 </span>
        <el-input
          v-model="conditionPoint"
          style="width: 200px; margin-right: 10px"
          type="number"
          placeholder="自动兑换免费抽奖次数积分门槛"
        ></el-input>
        <el-button
          @click="handleChangeRollPoint('FREE_LOTTERY_POINT', 'conditionPoint')"
          >提交</el-button
        >
      </div>

      <ul class="pool-list">
        <li v-for="(good, idx) in showList" :key="idx">
          <div class="content">
            <div class="operate">
              <span>名称：</span>
              <el-input
                class="w200 mr20"
                v-model="good.priceName"
                placeholder="请输入"
                :disabled="idx !== editIdx"
              ></el-input>

              <span>奖品：</span>
              <el-image
                v-if="editIdx === idx && editingUrl"
                class="w100 mr20"
                fit="contain"
                :src="editingUrl"
                :preview-src-list="[editingUrl]"
              >
                <div
                  slot="error"
                  class="image-slot"
                  style="background-color: #eee"
                >
                  <i class="el-icon-picture-outline"></i>
                </div>
              </el-image>
              <!-- 兜底场景： 编辑-上传图片-取消编辑 -->
              <el-image
                v-else
                class="w100 mr20"
                fit="contain"
                :src="good.priceImgUrl || good.showEditUrl"
                :preview-src-list="[good.priceImgUrl || good.showEditUrl]"
                style="border: 1px solid #eee; min-height: 50px"
              >
                <div
                  slot="error"
                  class="image-slot"
                  style="background-color: #eee"
                ></div>
              </el-image>
              <el-upload
                class="mr20"
                action=""
                :auto-upload="false"
                :show-file-list="false"
                :on-change="handleUploadChange"
              >
                <el-button
                  size="small"
                  type="primary"
                  :disabled="idx !== editIdx"
                  icon="el-icon-upload"
                  >上传图片</el-button
                >
              </el-upload>

              <span>中奖概率：</span>
              <el-input
                class="w100 mr20"
                v-model="good.probability"
                placeholder="请输入"
                :disabled="idx !== editIdx"
              ></el-input>

              <span>奖品数量：</span>
              <el-input
                class="w100 mr20"
                v-model="good.count"
                placeholder="请输入"
                :disabled="idx !== editIdx"
              ></el-input>

              <span>奖品阈值：</span>
              <el-input
                class="w100 mr20"
                v-model="good.threshold"
                placeholder="请输入"
                :disabled="idx !== editIdx"
              ></el-input>
            </div>

            <div>
              <el-button
                v-if="editIdx === idx"
                @click="handlePoolEditCancel"
                :disabled="isSubmitting"
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
              <el-button
                @click="handleDelete(idx)"
                type="danger"
                :disabled="isSubmitting"
                >删除</el-button
              >
            </div>
          </div>

          <el-divider></el-divider>
        </li>
        <li v-if="showList.length < 10">
          <el-button plain @click="handleAddOne">新增奖品</el-button>
        </li>
      </ul>
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
            <el-button type="text" size="small" @click="handleEditPswd(scope)"
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
        <el-form-item
          label="新密码"
          label-width="70"
          v-if="menuTab === 'editPswd'"
        >
          <el-input v-model="form.editPassword"></el-input>
        </el-form-item>
        <el-form-item
          label="免费奖池抽奖次数"
          label-width="70"
          type="number"
          v-if="menuTab === 'setting'"
        >
          <el-input v-model="form.freeCount"></el-input>
        </el-form-item>
        <el-form-item
          label="付费奖池抽奖次数"
          label-width="70"
          type="number"
          v-if="menuTab === 'setting'"
        >
          <el-input v-model="form.payCount"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCloseDialog">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Local } from "@/utils/storage";
export default {
  name: "AdminSetting",
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

      // 修改密码相关
      dialogTitle: "修改密码",
      dialogFormVisible: false,
      form: {
        editUserId: "",
        editPassword: "",
        freeCount: "",
        payCount: "",
      },

      conditionPoint: "",
      oneRollPoint: "",

      editingFile: null,
      editingUrl: "",

      isSubmitting: false,
      pageLoading: false,
    };
  },
  created() {
    const user = Local.get("user");
    // console.log("====", user);
    this.user = user;
    this.handleGetUserList();
    this.handleGetGlobalSetting();
    this.handleGetPool("免费奖池");
  },
  methods: {
    // 编辑抽奖次数 click
    handleEditRollCount(scope) {
      this.form.editUserId = scope.row.userId;
      this.dialogTitle = "抽奖设置";
      this.dialogFormVisible = true;
    },
    // 编辑密码 click
    handleEditPswd(scope) {
      this.form.editUserId = scope.row.userId;
      this.dialogTitle = "设置密码";
      this.dialogFormVisible = true;
    },
    handleCloseDialog() {
      this.dialogFormVisible = false;
      this.dialogTitle = "修改密码";
      this.form.editUserId = "";
      this.form.editPassword = "";
    },

    // dialog 提交
    handleSubmit() {
      if (this.menuTab === "setting") {
        this.handleUpdateRollCount();
      } else {
        this.handleUpdatePswd();
      }
    },

    // 获取全局配置
    handleGetGlobalSetting() {
      this.$api
        .getGlobalSetting()
        .then((res) => {
          if (res?.data && res?.data?.code === 200) {
            // console.log("::获取全局配置响应::", res);
            const data = res.data.data;
            if (data?.length) {
              data.forEach((item) => {
                if (item.type === "FREE_LOTTERY_POINT") {
                  this.conditionPoint = item.value;
                } else {
                  this.oneRollPoint = item.value;
                }
              });
            }
          } else {
            this.handleCodeNot200(res, "获取全局配置");
          }
        })
        .catch((e) => {
          this.handleRequestError(e);
        });
    },

    // 全局配置
    handleChangeRollPoint(
      type = "FREE_LOTTERY_POINT",
      valKey = "conditionPoint"
    ) {
      if (this[valKey] == "") return;
      this.$api
        .settingGlobalPoint({ type, value: Number(this[valKey]) })
        .then((res) => {
          // console.log("::全局配置请求响应::", res);
          if (res?.data && res?.data?.code === 200) {
            this.$message({
              message: "全局配置成功",
              type: "success",
            });
            this.handleGetGlobalSetting();
          } else {
            this.handleCodeNot200(res, "全局配置");
          }
        })
        .catch((e) => {
          this.handleRequestError(e);
        });
    },

    // 更新密码请求
    handleUpdatePswd() {
      this.$api
        .updatePswd({
          userId: this.form.editUserId,
          password: this.form.editPassword,
        })
        .then((res) => {
          // console.log("::更新密码请求相应::", res);
          if (res?.data && res?.data?.code === 200) {
            this.$message({
              message: "更新密码成功",
              type: "success",
            });
            this.handleCloseDialog();
            this.handleGetUserList();
          } else {
            this.handleCodeNot200(res, "更新密码");
          }
        })
        .catch((e) => {
          this.handleRequestError(e);
        });
    },

    // 更新免费抽奖次数请求
    handleUpdateRollCount() {
      this.$api
        .updateFreeRollCount({
          userId: this.form.editUserId,
          numberOfFreeLottery: this.form.freeCount,
          numberOfPayLottery: this.form.payCount,
        })
        .then((res) => {
          // console.log("::更新免费抽奖次数请求响应::", res);
          if (res?.data && res?.data?.code === 200) {
            this.$message({
              message: "更新免费抽奖次数成功",
              type: "success",
            });
            this.handleCloseDialog();
            this.handleGetUserList();
          } else {
            this.handleCodeNot200(res, "更新免费抽奖次数");
          }
        })
        .catch((e) => this.handleRequestError(e));
    },

    // 获取用户列表
    handleGetUserList() {
      this.tableLoading = true;
      this.$api
        .getUserList()
        .then((res) => {
          // console.log(":::获取用户列表响应:::", res);
          if (res?.data && res?.data?.code === 200) {
            this.userList = res.data.data;
          } else {
            this.handleCodeNot200(res, "获取用户列表");
          }
        })
        .catch((e) => {
          this.handleRequestError(e);
        })
        .finally(() => {
          this.tableLoading = false;
        });
    },

    // 获取奖池列表
    handleGetPool(opt = "免费奖池") {
      this.pageLoading = true;
      // POINT_LOTTERY FREE_LOTTERY
      this.$api
        .priceList({
          type: opt === "免费奖池" ? "FREE_LOTTERY" : "POINT_LOTTERY",
        })
        .then((res) => {
          if (res?.data && res?.data?.code === 200) {
            const list = res?.data?.data || [];
            this.showList = list;
          } else {
            this.handleCodeNot200(res, "获取奖池列表");
          }
        })
        .catch((e) => this.handleRequestError(e))
        .finally(() => {
          this.pageLoading = false;
        });
    },

    // 图片上传
    handleUploadChange(data) {
      this.editingFile = data.raw;
      this.showList[this.editIdx].showEditUrl = URL.createObjectURL(data.raw);
      this.editingUrl = URL.createObjectURL(data.raw);
    },

    // 奖池设置相关
    // 保存单个奖池编辑请求
    handleSubmitEditPool(item) {
      this.isSubmitting = true;
      const { priceName, probability } = item;
      const formData = new FormData();
      formData.append("priceName", priceName);
      formData.append("probability", probability);
      // type: POINT_LOTTERY FREE_LOTTERY
      formData.append(
        "type",
        this.poolType === "免费奖池" ? "FREE_LOTTERY" : "POINT_LOTTERY"
      );

      if ("id" in item) {
        if (this.editingFile) {
          formData.append("priceImg", this.editingFile);
        }
        formData.append("id", item.id);
        // 编辑
        this.$api
          .updatePrice(formData)
          .then((res) => {
            // console.log("::编辑奖品请求响应::", res);
            if (res?.data && res?.data?.code === 200) {
              this.$message({
                message: "编辑奖品成功",
                type: "success",
              });
              this.editIdx = -1;
              this.editingFile = null;
              this.editingUrl = "";
              this.handleGetPool();
            } else {
              this.handleCodeNot200(res, "编辑奖品");
            }
          })
          .catch((e) => this.handleRequestError(e))
          .finally(() => {
            this.isSubmitting = false;
          });
      } else {
        formData.append("priceImg", this.editingFile);
        // 新增
        this.$api
          .addPrice(formData)
          .then((res) => {
            // console.log("::新增奖品请求响应::", res);
            if (res?.data && res?.data?.code === 200) {
              this.$message({
                message: "新增奖品成功",
                type: "success",
              });
              this.editIdx = -1;
              this.editingFile = null;
              this.editingUrl = "";
              this.handleGetPool();
            } else {
              this.handleCodeNot200(res, "新增奖品");
            }
          })
          .catch((e) => this.handleRequestError(e))
          .finally(() => {
            this.isSubmitting = false;
          });
      }
    },
    handlePoolEditClick(idx) {
      this.editIdx = idx;
    },

    // 删除
    handleDelete(idx) {
      if ("id" in this.showList[idx]) {
        this.$confirm("确认删除？", "提示")
          .then(() => {
            const params = {
              id: this.showList[idx].id,
              type:
                this.poolType === "免费奖池" ? "FREE_LOTTERY" : "POINT_LOTTERY",
            };
            this.$api
              .deletePrice(params)
              .then((res) => {
                if (res?.data && res?.data?.code === 200) {
                  this.showList.splice(idx, 1);
                  this.editIdx = -1;

                  this.$message({
                    message: "删除成功",
                    type: "success",
                  });
                } else {
                  this.handleCodeNot200(res, "删除奖品");
                }
              })
              .catch((e) => this.handleRequestError(e));
          })
          .catch(() => {});
      } else {
        this.showList.splice(idx, 1);
        this.editIdx = -1;
      }
    },

    handlePoolEditCancel() {
      this.editIdx = -1;
      this.editingFile = null;
      this.editingUrl = "";
    },
    handlePoolTypeChange(val) {
      this.handlePoolEditCancel();
      this.handleGetPool(val);
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

    // 新增一个
    handleAddOne() {
      if (this.showList.length >= 10) return;
      if (this.poolType === "免费奖池") {
        this.showList.push({
          priceName: "",
          src: "",
          priceImgUrl: null,
          probability: 0,
          count: 0, // 数量
          threshold: 0, // 阈值
          disabled: false,
        });
      } else {
        this.showList.push({
          priceName: "",
          src: "",
          priceImgUrl: null,
          probability: 0,
          count: 0, // 数量
          threshold: 0, // 阈值
          disabled: false,
        });
      }

      this.$nextTick(() => {
        this.editIdx = this.showList.length - 1;
      });
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
  overflow: auto;

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
