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
      :rows="5"
      :cols="5"
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
      width="30%"
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
      domTop: "18rem",
      domFontSize: "16px",

      count: 0, // 剩余免费抽奖次数
      points: 0, // 剩余积分
      ticket: 0, // 单次抽奖积分

      timer: null,
      loading: false,
      resultDialog: false,
      result: null, // 抽奖结果

      // 组件参数
      blocks: [
        { padding: "4px", background: "#869cfa" },
        { padding: "4px", background: "#e9e8fe" },
      ],
      prizes: [],
      buttons: [
        {
          x: 2,
          y: 2,
          background: "#7f95d1",
          borderRadius: "2px",
          // fonts: [{ text: "开始", fontSize: "14px" }],
          imgs: [
            {
              src: "https://bpic.588ku.com/element_origin_min_pic/19/04/22/e9ca193bcb91f9211b5fc59ae437a23e.jpg",
              width: "100%",
            },
          ],
        },
      ],
      defaultStyle: {
        background: "#b8c5f2",
      },
    };
  },
  watch: {
    rollType: {
      handler(n) {
        this.handleGetPool(n);
      },
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
      this.loading = true;
      console.log("[请求奖池]", type);
      this.handleInitUserInfo();
      this.handleReset();

      setTimeout(() => {
        this.prizes = [
          {
            x: 0,
            y: 0,
            // fonts: [{ text: "1", top: "70%", fontSize: "14px" }],
            imgs: [
              {
                src: "https://assetsio.reedpopcdn.com/cs-go.jpeg?width=1600&height=900&fit=crop&quality=100&format=png&enable=upscale&auto=webp",
                width: "90%",
                height: "90%",
                top: "5%",
              },
            ],
            range: 1,
            borderRadius: "4px",
            label: "啊实打实大苏打撒旦撒",
          },
          {
            x: 1,
            y: 0,
            // fonts: [{ text: "1", top: "70%", fontSize: "14px" }],
            imgs: [
              {
                src: "https://assetsio.reedpopcdn.com/cs-go.jpeg?width=1600&height=900&fit=crop&quality=100&format=png&enable=upscale&auto=webp",
                width: "90%",
                height: "90%",
                top: "5%",
              },
            ],
            range: 0,
            borderRadius: "4px",
          },
          {
            x: 2,
            y: 0,
            // fonts: [{ text: "继续努力", top: "70%", fontSize: "14px" }],
            imgs: [
              {
                src: "https://assetsio.reedpopcdn.com/cs-go.jpeg?width=1600&height=900&fit=crop&quality=100&format=png&enable=upscale&auto=webp",
                width: "90%",
                height: "90%",
                top: "5%",
              },
            ],
            range: 0,
            borderRadius: "4px",
          },
          {
            x: 3,
            y: 0,
            // fonts: [{ text: "3", top: "70%", fontSize: "14px" }],
            imgs: [
              {
                src: "https://assetsio.reedpopcdn.com/cs-go.jpeg?width=1600&height=900&fit=crop&quality=100&format=png&enable=upscale&auto=webp",
                width: "90%",
                height: "90%",
                top: "5%",
              },
            ],
            range: 0,
            borderRadius: "4px",
          },
          {
            x: 4,
            y: 0,
            // fonts: [{ text: "4", top: "70%", fontSize: "14px" }],
            imgs: [
              {
                src: "https://assetsio.reedpopcdn.com/cs-go.jpeg?width=1600&height=900&fit=crop&quality=100&format=png&enable=upscale&auto=webp",
                width: "90%",
                height: "90%",
                top: "5%",
              },
            ],
            range: 0,
            borderRadius: "4px",
          },
          {
            x: 4,
            y: 1,
            // fonts: [{ text: "5", top: "70%", fontSize: "14px" }],
            imgs: [
              {
                src: "https://assetsio.reedpopcdn.com/cs-go.jpeg?width=1600&height=900&fit=crop&quality=100&format=png&enable=upscale&auto=webp",
                width: "90%",
                height: "90%",
                top: "5%",
              },
            ],
            range: 0,
            borderRadius: "4px",
          },
          {
            x: 4,
            y: 2,
            // fonts: [{ text: "6", top: "70%", fontSize: "14px" }],
            imgs: [
              {
                src: "https://assetsio.reedpopcdn.com/cs-go.jpeg?width=1600&height=900&fit=crop&quality=100&format=png&enable=upscale&auto=webp",
                width: "90%",
                height: "90%",
                top: "5%",
              },
            ],
            range: 0,
            borderRadius: "4px",
          },
          {
            x: 4,
            y: 3,
            // fonts: [{ text: "7", top: "70%", fontSize: "14px" }],
            imgs: [
              {
                src: "https://assetsio.reedpopcdn.com/cs-go.jpeg?width=1600&height=900&fit=crop&quality=100&format=png&enable=upscale&auto=webp",
                width: "90%",
                height: "90%",
                top: "5%",
              },
            ],
            range: 0,
            borderRadius: "4px",
          },
          {
            x: 4,
            y: 4,
            // fonts: [{ text: "8", top: "70%", fontSize: "14px" }],
            imgs: [
              {
                src: "https://assetsio.reedpopcdn.com/cs-go.jpeg?width=1600&height=900&fit=crop&quality=100&format=png&enable=upscale&auto=webp",
                width: "90%",
                height: "90%",
                top: "5%",
              },
            ],
            range: 0,
            borderRadius: "4px",
          },
          {
            x: 3,
            y: 4,
            // fonts: [{ text: "9", top: "70%", fontSize: "14px" }],
            imgs: [
              {
                src: "https://assetsio.reedpopcdn.com/cs-go.jpeg?width=1600&height=900&fit=crop&quality=100&format=png&enable=upscale&auto=webp",
                width: "90%",
                height: "90%",
                top: "5%",
              },
            ],
            range: 0,
            borderRadius: "4px",
          },
          {
            x: 2,
            y: 4,
            // fonts: [{ text: "10", top: "70%", fontSize: "14px" }],
            imgs: [
              {
                src: "https://assetsio.reedpopcdn.com/cs-go.jpeg?width=1600&height=900&fit=crop&quality=100&format=png&enable=upscale&auto=webp",
                width: "90%",
                height: "90%",
                top: "5%",
              },
            ],
            range: 0,
            borderRadius: "4px",
          },
          {
            x: 1,
            y: 4,
            // fonts: [{ text: "11", top: "70%", fontSize: "14px" }],
            imgs: [
              {
                src: "https://assetsio.reedpopcdn.com/cs-go.jpeg?width=1600&height=900&fit=crop&quality=100&format=png&enable=upscale&auto=webp",
                width: "90%",
                height: "90%",
                top: "5%",
              },
            ],
            range: 0,
            borderRadius: "4px",
          },
          {
            x: 0,
            y: 4,
            // fonts: [{ text: "12", top: "70%", fontSize: "14px" }],
            imgs: [
              {
                src: "https://assetsio.reedpopcdn.com/cs-go.jpeg?width=1600&height=900&fit=crop&quality=100&format=png&enable=upscale&auto=webp",
                width: "90%",
                height: "90%",
                top: "5%",
              },
            ],
            range: 0,
            borderRadius: "4px",
          },
          {
            x: 0,
            y: 3,
            // fonts: [{ text: "13", top: "70%", fontSize: "14px" }],
            imgs: [
              {
                src: "https://assetsio.reedpopcdn.com/cs-go.jpeg?width=1600&height=900&fit=crop&quality=100&format=png&enable=upscale&auto=webp",
                width: "90%",
                height: "90%",
                top: "5%",
              },
            ],
            range: 0,
            borderRadius: "4px",
          },
          {
            x: 0,
            y: 2,
            // fonts: [{ text: "14", top: "70%", fontSize: "14px" }],
            imgs: [
              {
                src: "https://assetsio.reedpopcdn.com/cs-go.jpeg?width=1600&height=900&fit=crop&quality=100&format=png&enable=upscale&auto=webp",
                width: "90%",
                height: "90%",
                top: "5%",
              },
            ],
            range: 0,
            borderRadius: "4px",
          },
          {
            x: 0,
            y: 1,
            // fonts: [{ text: "15", top: "70%", fontSize: "14px" }],
            imgs: [
              {
                src: "https://assetsio.reedpopcdn.com/cs-go.jpeg?width=1600&height=900&fit=crop&quality=100&format=png&enable=upscale&auto=webp",
                width: "90%",
                height: "90%",
                top: "5%",
              },
            ],
            range: 0,
            borderRadius: "4px",
          },
        ];
        this.loading = false;
      }, 1000);
    },

    // 设置展示
    handleInitUserInfo() {
      this.count = 1;
      this.points = 1300;
      this.ticket = 500;
    },

    handleOpenResult() {
      this.resultDialog = true;
    },

    handleClose() {
      this.resultDialog = false;
    },

    // 判断设备
    handleCheckDeviceType() {
      const windowWidth = window.innerWidth; // 获取窗口宽度
      if (windowWidth <= 820) {
        // 小于820即为移动端
        // console.log("[]当前为移动端设备[]");
        this.canvasWidth = "24.3rem";
        this.canvasHeight = "24.3rem";
        this.domTop = "10rem";
        this.domFontSize = "12px";
      } else {
        // 大于等于820即为PC端
        // console.log("[]当前为PC端设备[]");
        this.canvasWidth = "48.3rem";
        this.canvasHeight = "48.3rem";
        this.domTop = "18rem";
        this.domFontSize = "16px";
      }
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
