/**
 * 技术部预设名单
 */
export const TECH_DEPT_MEMBERS = `林俊才
严燕萍
刘团伟
张朝臣
陈建
陈一臣
张超杰
欧石平
南欣阳
陈伟
陈文宇
秦杨杨
陈河铮
许贵华
林子珉
何佳靖
程取红
文伟强`;

/**
 * 抽奖动画配置
 */
export const LOTTERY_ANIMATION = {
  ROLL_DURATION: 2200, // 滚动持续时间(ms)
  TICK_INITIAL: 60,    // 初始滚动间隔(ms)  
  TICK_MAX: 300,       // 最大滚动间隔(ms)
  CONFETTI_TIMES: 3,   // 彩带爆发次数
  CONFETTI_DURATION: 800, // 每次彩带持续时间(ms)
};

/**
 * UI 样式常量
 */
export const UI_STYLES = {
  HEADER_GRADIENT: "bg-gradient-to-r from-fuchsia-500 via-purple-500 to-sky-400",
  TOAST_AUTO_CLOSE_TIME: 2800, // Toast自动关闭时间(ms)
  HISTORY_MAX_RECORDS: 5, // 历史记录最大条数
};

/**
 * 彩带特效配置
 */
export const CONFETTI_CONFIG = {
  particleCount: 120,
  spread: 70,
  startVelocity: 35,
  gravity: 0.9,
  scalar: 1.2,
};
