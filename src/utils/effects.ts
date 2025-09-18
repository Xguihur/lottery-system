import confetti from "canvas-confetti";
import { CONFETTI_CONFIG, LOTTERY_ANIMATION } from "@/constants";

/**
 * 彩带特效
 * @param times 爆发次数，默认为3次
 */
export function burstConfetti(times: number = LOTTERY_ANIMATION.CONFETTI_TIMES) {
  const { CONFETTI_DURATION } = LOTTERY_ANIMATION;
  
  for (let i = 0; i < times; i++) {
    setTimeout(() => {
      confetti({
        ...CONFETTI_CONFIG,
        origin: { x: Math.random() * 0.6 + 0.2, y: 0.2 },
      });
    }, i * CONFETTI_DURATION);
  }
}
