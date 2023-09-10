<template>
  <div class="custom-roll">
    <LuckyGrid
      class="canvas"
      ref="rollRef"
      :width="canvasWidth"
      :height="canvasHeight"
      :prizes="prizes"
      :blocks="blocks"
      :buttons="buttons"
      :rows="5"
      :cols="5"
      @start="startCallback"
      @end="endCallback"
    />

    <div class="canvas-dom" :style="{ top: domTop, fontSize: domFontSize }">
      <div v-if="rollType === 'free'" class="blod">剩余次数：{{ count }}</div>
      <div v-else class="blod">剩余积分：{{ points }}，{{ ticket }}积分/次</div>
    </div>
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

      // 组件参数
      blocks: [
        { padding: "4px", background: "#869cfa" },
        { padding: "4px", background: "#e9e8fe" },
      ],
      prizes: [
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
      ],
      buttons: [
        {
          x: 2,
          y: 2,
          // background: "#7f95d1",
          // fonts: [{ text: "开始", top: "70%", fontSize: "14px" }],
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
  created() {
    this.handleCheckDeviceType();
  },
  mounted() {
    this.$refs.rollRef.init();
  },
  methods: {
    // 点击抽奖按钮会触发star回调
    startCallback() {
      // 调用抽奖组件的play方法开始游戏
      this.$refs.rollRef.play();
      // 模拟调用接口异步抽奖
      this.timer = setTimeout(() => {
        // 调用stop停止旋转并传递中奖索引
        this.$refs.rollRef.stop();
      }, 3000);
    },

    handleCheckDeviceType() {
      const windowWidth = window.innerWidth; // 获取窗口宽度
      if (windowWidth <= 820) {
        // 小于820即为移动端
        console.log("[]当前为移动端设备[]");
        this.canvasWidth = "24.3rem";
        this.canvasHeight = "24.3rem";
        this.domTop = "10rem";
        this.domFontSize = "12px";
      } else {
        // 大于等于820即为PC端
        console.log("[]当前为PC端设备[]");
        this.canvasWidth = "48.3rem";
        this.canvasHeight = "48.3rem";
        this.domTop = "18rem";
        this.domFontSize = "16px";
      }
      this.handleSetPrizes();
    },

    handleSetPrizes() {
      return false;
    },

    // 抽奖结束会触发end回调
    endCallback(prize) {
      console.log(prize);
      if (this.rollType === "free") {
        this.count = 10;
      } else {
        this.points = 100;
      }
    },

    handleSetTimer(val) {
      this.$refs.rollRef.init();
      this.timer = val;
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
  height: 100px;
  position: absolute;
  // top: 300px;
  left: 50%;
  transform: translateX(-50%);
}
</style>
