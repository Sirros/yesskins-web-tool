<template>
  <LuckyGrid
    ref="myLucky"
    width="800px"
    height="800px"
    :prizes="prizes"
    :blocks="blocks"
    :buttons="buttons"
    :rows="5"
    :cols="5"
    @start="startCallback"
    @end="endCallback"
  />
</template>

<script>
export default {
  data() {
    return {
      blocks: [
        { padding: "10px", background: "#869cfa" },
        { padding: "10px", background: "#e9e8fe" },
      ],
      prizes: [
        {
          x: 0,
          y: 0,
          fonts: [{ text: "0", top: "10%" }],
          imgs: [
            {
              src: "https://assetsio.reedpopcdn.com/cs-go.jpeg?width=1600&height=900&fit=crop&quality=100&format=png&enable=upscale&auto=webp",
              width: "130px",
              height: "130px",
            },
          ],
        },
        { x: 1, y: 0, fonts: [{ text: "1", top: "10%" }] },
        { x: 2, y: 0, fonts: [{ text: "2", top: "10%" }] },
        { x: 3, y: 0, fonts: [{ text: "3", top: "10%" }] },
        { x: 4, y: 0, fonts: [{ text: "4", top: "10%" }] },
        { x: 4, y: 1, fonts: [{ text: "5", top: "10%" }] },
        { x: 4, y: 2, fonts: [{ text: "6", top: "10%" }] },
        { x: 4, y: 3, fonts: [{ text: "7", top: "10%" }] },
        { x: 4, y: 4, fonts: [{ text: "8", top: "10%" }] },
        { x: 3, y: 4, fonts: [{ text: "9", top: "10%" }] },
        { x: 2, y: 4, fonts: [{ text: "10", top: "10%" }] },
        { x: 1, y: 4, fonts: [{ text: "11", top: "10%" }] },
        { x: 0, y: 4, fonts: [{ text: "12", top: "10%" }] },
        { x: 0, y: 3, fonts: [{ text: "13", top: "10%" }] },
        { x: 0, y: 2, fonts: [{ text: "14", top: "10%" }] },
        { x: 0, y: 1, fonts: [{ text: "15", top: "10%" }] },
      ],
      buttons: [
        {
          x: 2,
          y: 2,
          background: "#7f95d1",
          fonts: [{ text: "开始", top: "40%" }],
        },
      ],
      defaultStyle: {
        background: "#b8c5f2",
      },
    };
  },
  methods: {
    // 点击抽奖按钮会触发star回调
    startCallback() {
      // 调用抽奖组件的play方法开始游戏
      this.$refs.myLucky.play();
      // 模拟调用接口异步抽奖
      setTimeout(() => {
        // 假设后端返回的中奖索引是0
        const index = 1;
        // 调用stop停止旋转并传递中奖索引
        this.$refs.myLucky.stop(index);
      }, 3000);
    },
    // 抽奖结束会触发end回调
    endCallback(prize) {
      console.log(prize);
    },
  },
};
</script>
