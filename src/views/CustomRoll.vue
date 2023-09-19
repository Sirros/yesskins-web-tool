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
      canvasWidth: "44.3rem",
      canvasHeight: "44.3rem",
      domTop: "20rem",
      domFontSize: "16px",

      count: 0, // 剩余免费抽奖次数
      points: 0, // 剩余积分
      ticket: 0, // 单次抽奖积分

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
        background: "#24ADB2",
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
    this.handleGetPool();
    this.handleCheckDeviceType();
  },
  methods: {
    // 开始抽奖
    handleStartCallback() {
      if (this.rollType === "free") {
        if (this.count === 0) return;
      } else {
        if (this.points / this.ticket < 1) return;
      }
      console.log("开始抽奖{}::");
      // 调用抽奖组件的play方法开始游戏
      this.$refs.myLucky.play();
      // 模拟调用接口异步抽奖
      this.timer = setTimeout(() => {
        // 调用stop停止旋转并传递中奖索引
        this.$refs?.myLucky?.stop();
      }, 3000);
    },

    // 抽奖结束
    handleEndCallback(prize) {
      console.log("抽奖结束{}::", prize);
      this.result = Object.values(prize).length ? prize : null;
      if (!Object.values(prize).length) return;
      if (this.rollType === "free") {
        this.count = 0;
      } else {
        this.points -= this.ticket;
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
      console.log(type);
      this.loading = true;
      console.log("[请求奖池]", type);
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

      // const list = [
      //   {
      //     id: 2,
      //     priceName: "aaaaaab",
      //     probability: 0.5,
      //     priceImgUrl:
      //       "https://i.c5game.com/image/u-5542106315dd251120fcae.jpg",
      //   },
      //   {
      //     id: 3,
      //     priceName: "s",
      //     probability: 0.5,
      //     priceImgUrl:
      //       "https://i.c5game.com/image/u-5542106315dd251120fcae.jpg",
      //   },
      //   {
      //     id: 4,
      //     priceName: "测试1",
      //     probability: 0.11,
      //     priceImgUrl:
      //       "https://i.c5game.com/image/u-5542106315dd251120fcae.jpg",
      //   },
      //   {
      //     id: 5,
      //     priceName: "测试1",
      //     probability: 0.1,
      //     priceImgUrl:
      //       "https://i.c5game.com/image/u-5542106315dd251120fcae.jpg",
      //   },
      //   {
      //     id: 6,
      //     priceName: "测试2",
      //     probability: 0.03,
      //     priceImgUrl:
      //       "https://i.c5game.com/image/u-5542106315dd251120fcae.jpg",
      //   },
      //   {
      //     id: 7,
      //     priceName: "测试3",
      //     probability: 0.5,
      //     priceImgUrl:
      //       "https://i.c5game.com/image/u-5542106315dd251120fcae.jpg",
      //   },
      //   {
      //     id: 8,
      //     priceName: "测试4",
      //     probability: 0.4,
      //     priceImgUrl:
      //       "https://i.c5game.com/image/u-5542106315dd251120fcae.jpg",
      //   },
      //   {
      //     id: 9,
      //     priceName: "测试5",
      //     probability: 0.12,
      //     priceImgUrl:
      //       "https://i.c5game.com/image/u-5542106315dd251120fcae.jpg",
      //   },
      //   {
      //     id: 10,
      //     priceName: "da",
      //     probability: 0.5,
      //     priceImgUrl:
      //       "https://i.c5game.com/image/u-5542106315dd251120fcae.jpg",
      //   },
      //   {
      //     id: 11,
      //     priceName: "测试7",
      //     probability: 0.11,
      //     priceImgUrl:
      //       "https://i.c5game.com/image/u-5542106315dd251120fcae.jpg",
      //   },
      // ];
      // const newPrizes = [];
      // list.forEach((prize, idx) => {
      //   const { priceName, probability, priceImgUrl } = prize;
      //   // const priceImgUrl =
      //   //   "https://i.c5game.com/image/u-5542106315dd251120fcae.jpg";
      //   const { x, y } = this.prizes[idx];
      //   newPrizes.push({
      //     x,
      //     y,
      //     range: probability,
      //     label: priceName,
      //     imgs: [
      //       {
      //         src: priceImgUrl,
      //         width: "92%",
      //         height: "92%",
      //         top: "4%",
      //       },
      //     ],
      //     borderRadius: "4px",
      //     background: "#002976",
      //   });
      //   return;
      // });
      // this.prizes = newPrizes;
    },

    // 设置展示
    handleInitUserInfo() {
      // this.count = 1;
      // this.points = 1300;
      // this.ticket = 500;

      this.$api
        .detail()
        .then((res) => {
          if (res?.data && res?.data?.code === 200) {
            this.points = res?.data?.data?.point;

            // this.points = 1300;
            // this.ticket = 500;
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
      const { id, range, imgs, label } = this.result;

      this.$api
        .sendPrize({
          id,
          type: this.poolType,
          imgs,
          priceName: label,
          probability: range,
          priceImg: imgs[0].src,
          priceImgUrl: imgs[0].src,
        })
        .then((res) => {
          console.log("::发送结果请求响应::", res);
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
