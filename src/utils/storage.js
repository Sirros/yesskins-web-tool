// 本地储存
export const Local = {
  // 设置永久缓存
  set(key, val) {
    window.localStorage.setItem(key, JSON.stringify(val));
  },
  // 获取永久缓存
  get(key) {
    let json = window.localStorage.getItem(key);
    const obj = JSON.parse(json);

    if (obj?.time) {
      const loginTime = obj.time;
      const nowTime = new Date().getTime();
      // 计算两个时间戳之间相差的毫秒数
      const diffMilliseconds = Math.abs(loginTime - nowTime);
      console.log(loginTime, nowTime, diffMilliseconds);
      // 判断相差的分钟数是否大于10分钟
      if (diffMilliseconds / (1000 * 60) > 2) {
        return null;
      } else {
        return JSON.parse(json);
      }
    } else {
      return null;
    }
  },
  // 移除永久缓存
  remove(key) {
    window.localStorage.removeItem(key);
  },
  // 移除全部永久缓存
  clear() {
    window.localStorage.clear();
  },
};
