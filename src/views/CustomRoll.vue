<template>
  <div class="custom-roll">
    <LuckyGrid
      v-loading="loading"
      class="canvas"
      ref="myLucky"
      :width="canvasWidth"
      :height="canvasHeight"
      :prizes="prizes"
      :blocks="blocks"
      :buttons="buttons"
      :rows="3"
      :cols="4"
      :default-style="defaultStyle"
      :active-style="activeStyle"
      @start="handleStartCallback"
      @end="handleEndCallback"
    />

    <div
      class="canvas-dom"
      v-if="!loading"
      :style="{ top: domTop, fontSize: domFontSize }"
    >
      <div v-if="rollType === 'free'" class="blod">剩余次数：{{ count }}</div>
      <div v-else class="blod">剩余积分：{{ points }}，{{ ticket }}积分/次</div>
    </div>

    <el-dialog
      v-if="!!result"
      title="抽奖结果"
      width="60%"
      :visible.sync="resultDialog"
      :before-close="handleClose"
    >
      <el-image :src="result.imgs[0].src"></el-image>
      <div class="blod mt5" style="font-size: 18px">{{ result.label }}</div>
      <el-alert
        class="mt10"
        title="恭喜你，抽奖结果已发送至管理员，请注意查收"
        type="success"
        center
        style="width: 100% !important"
        :closable="false"
      >
      </el-alert>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleClose">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { Local } from "@/utils/storage";
export default {
  name: "CustomRoll",
  props: {
    rollType: {
      type: String,
      default: "free",
    },
  },
  data() {
    return {
      user: null,

      canvasWidth: "44.3rem",
      canvasHeight: "44.3rem",
      domTop: "20rem",
      domFontSize: "16px",

      count: 0, // 剩余免费抽奖次数
      points: 0, // 剩余积分
      ticket: 0, // 单次抽奖积分
      condition: 0, // 兑换多少积分可以换取一次免费抽奖机会

      timer: null,
      loading: false,
      resultDialog: false,
      result: null, // 抽奖结果
      poolType: "FREE_LOTTERY", // POINT_LOTTERY FREE_LOTTERY

      // 组件参数
      blocks: [
        { padding: "10px", background: "#006BFF", borderRadius: "8px" },
        {
          padding: "4px",
          background: "#1551C1",
          borderRadius: "8px",
        },
      ],
      prizes: [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 2, y: 0 },
        { x: 3, y: 0 },
        { x: 3, y: 1 },
        { x: 3, y: 2 },
        { x: 2, y: 2 },
        { x: 1, y: 2 },
        { x: 0, y: 2 },
        { x: 0, y: 1 },
      ],
      buttons: [
        {
          x: 1,
          y: 1,
          col: 2,
          background: "#fff",
          borderRadius: "2px",
          imgs: [
            {
              src: "https://bpic.588ku.com/element_origin_min_pic/19/04/22/e9ca193bcb91f9211b5fc59ae437a23e.jpg",
              height: "100%",
            },
          ],
        },
      ],
      defaultStyle: {
        background: "#26C0B1",
      },
      activeStyle: {
        background: "#ffffff",
      },
    };
  },
  watch: {
    rollType: {
      handler(n) {
        this.handleGetPool(n);
        this.poolType = n === "free" ? "FREE_LOTTERY" : "POINT_LOTTERY";
      },
      immediate: true,
    },
  },
  created() {
    const user = Local.get("user");
    if (!user) {
      return this.$message.error("登录异常，请重新登录后重试");
    }
    this.user = user;
    this.handleGetPool();
    this.handleGetGlobalSetting();
    this.handleCheckDeviceType();
  },
  methods: {
    // 开始抽奖
    handleStartCallback() {
      if (this.rollType === "free") {
        if (this.count === 0) return;
      } else {
        if (this.points === 0) return;
        if (this.points / this.ticket < 1) return;
      }
      // 调用抽奖组件的play方法开始游戏
      this.$refs.myLucky.play();
      // 模拟调用接口异步抽奖
      this.timer = setTimeout(() => {
        // 调用stop停止旋转并传递中奖索引
        this.$refs?.myLucky?.stop();
      }, 3500);

      // TODO:
      // this.$api
      // .xxx()
      // .then((res) => {
      //   // 假设后端返回的中奖索引是0
      //   const index = 0
      //   // 调用stop停止旋转并传递中奖索引
      //   this.$refs.myLucky.stop(index)
      // })
      // .finally(() => {
      //   this.loading = false;
      // });
    },

    // 抽奖结束
    handleEndCallback(prize) {
      console.log("抽奖结束{}::", prize);
      if (prize.label === "再来一次") {
        this.$message.info("再来一次吧~");
        return;
      }
      this.result = Object.values(prize).length ? prize : null;
      if (!Object.values(prize).length) return;
      // 如果是免费的，抽完奖，更新一次免费抽奖次数，付费的话，抽完扣积分
      if (this.poolType === "FREE_LOTTERY") {
        this.handleUpdateFreeCount();
      } else {
        this.handleUpdatePoint();
      }
      this.handleOpenResult();
    },

    // 初始化
    handleReset(val) {
      this.$nextTick(() => {
        this.$refs.myLucky.init();
        clearTimeout(this.timer);
        this.timer = val;
        this.result = null;
      });
    },

    handleGetPool(type = "free") {
      this.loading = true;
      // console.log("[请求奖池]", type);
      this.handleInitUserInfo();
      this.handleReset();

      // POINT_LOTTERY和FREE_LOTTERY
      this.$api
        .priceList({ type: type === "free" ? "FREE_LOTTERY" : "POINT_LOTTERY" })
        .then((res) => {
          console.log(res);
          const data = res?.data?.data || [];
          const newPrizes = data.map((prize, idx) => {
            const { priceName, probability, priceImgUrl } = prize;
            return {
              ...this.prizes[idx],
              range: probability,
              label: priceName,
              imgs: [
                {
                  src: priceImgUrl,
                  width: "90%",
                  height: "90%",
                  top: "5%",
                },
              ],
              borderRadius: "4px",
            };
          });
          this.prizes = newPrizes;
        })
        .finally(() => {
          this.loading = false;
        });
    },

    // 全局配置
    handleGetGlobalSetting() {
      this.$api
        .getGlobalSetting()
        .then((res) => {
          if (res?.data && res?.data?.code === 200) {
            console.log("::获取全局配置响应::", res);
            const data = res.data.data;
            if (data?.length) {
              data.forEach((item) => {
                if (item.type === "FREE_LOTTERY_POINT") {
                  this.condition = Number(item.value);
                }
                if (item.type === "LOTTERY_POINT") {
                  this.ticket = Number(item.value);
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

    // 更新免费抽奖次数
    handleUpdateFreeCount() {
      this.$api
        .userUpdateFreeRollCountUser()
        .then((res) => {
          if (res?.data && res?.data?.code !== 200) {
            this.handleCodeNot200(res, "更新免费抽奖次数");
            this.handleInitUserInfo();
          }
        })
        .catch((e) => this.handleRequestError(e));
    },

    // 积分抽奖，更新次数
    handleUpdatePoint() {
      this.$api
        .exchangeTime()
        .then((res) => {
          if (res?.data && res?.data?.code !== 200) {
            this.handleCodeNot200(res, "积分抽奖，更新积分");
            this.handleInitUserInfo();
          }
        })
        .catch((e) => this.handleRequestError(e));
    },

    // 设置展示
    handleInitUserInfo() {
      this.$api
        .detail()
        .then((res) => {
          if (res?.data && res?.data?.code === 200) {
            this.points = res?.data?.data?.point;
            this.count = res?.data?.data?.numberOfFreeLottery;
          } else {
            this.$message({
              message: res?.data?.message || "获取详情失败，请三分钟后重试",
              type: "warning",
            });
          }
        })
        .catch((e) => {
          console.log("获取详情失败，请重试", e);
          this.$message({
            message: "获取详情失败，请重试",
            type: "warning",
          });
        });
    },

    handleOpenResult() {
      this.resultDialog = true;
      this.sendRollResult();
    },

    sendRollResult() {
      // 发送抽奖结果
      const { label } = this.result;

      this.$api
        .sendPrize({
          type: this.poolType,
          priceName: label,
        })
        .then((res) => {
          // console.log("::发送结果请求响应::", res);
          if (res?.data && res?.data?.code === 200) {
            this.$message({
              message: "发送结果成功",
              type: "success",
            });
          } else {
            this.handleCodeNot200(res, "发送结果");
          }
        });
    },

    handleClose() {
      this.resultDialog = false;

      // 更新一次积分
      this.handleInitUserInfo();
    },

    // 判断设备
    handleCheckDeviceType() {
      const windowWidth = window.innerWidth; // 获取窗口宽度
      if (windowWidth <= 820) {
        // 小于820即为移动端
        // console.log("[]当前为移动端设备[]");
        this.canvasWidth = "24.3rem";
        this.canvasHeight = "24.3rem";
        this.domTop = "12rem";
        this.domFontSize = "12px";
      } else {
        // 大于等于820即为PC端
        // console.log("[]当前为PC端设备[]");
        this.canvasWidth = "48.3rem";
        this.canvasHeight = "48.3rem";
        this.domTop = "20rem";
        this.domFontSize = "16px";
      }
    },

    handleCodeNot200(res, type) {
      this.$message({
        message: res?.data?.message || type + "请求异常，请联系管理员",
        type: "warning",
      });
    },

    // 根据概率 **** 内置了中奖概率
    // start() {
    //   const rand = Math.random();
    //   let cumulativeProbability = 0;

    //   for (const prize of this.prizes) {
    //     cumulativeProbability += prize.probability;

    //     if (rand <= cumulativeProbability) {
    //       this.winner = prize;
    //       return;
    //     }
    //   }
    // },
  },
};
</script>

<style lang="scss" scoped>
.custom-roll {
  display: flex;
  justify-content: center;
  padding-top: 40px;
  position: relative;
}

.canvas {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.canvas-dom {
  // height: 100px;
  position: absolute;
  // top: 300px;
  left: 50%;
  transform: translateX(-50%);
}
</style>
