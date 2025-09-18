import { useState, useMemo, useRef } from "react";
import { parseCandidates, sampleUnique, clampPickCount, sleep } from "@/utils";
import { burstConfetti } from "@/utils/effects";
import { LOTTERY_ANIMATION, UI_STYLES } from "@/constants";

/**
 * 抽奖逻辑Hook
 * @param showToast Toast显示函数
 * @returns 抽奖相关状态和操作函数
 */
export function useLottery(showToast: (params: { title?: string; description?: string }) => void) {
  const [rawText, setRawText] = useState("");
  const [need, setNeed] = useState(1);
  const [dedupe, setDedupe] = useState(true);
  const [rolling, setRolling] = useState(false);
  const [result, setResult] = useState<string[]>([]);
  const [history, setHistory] = useState<string[][]>([]);
  const [rollName, setRollName] = useState<string>("");

  const rollRef = useRef<HTMLDivElement | null>(null);
  const candidates = useMemo(() => parseCandidates(rawText, dedupe), [rawText, dedupe]);

  const startDraw = async () => {
    if (rolling) return;
    
    if (candidates.length === 0) {
      showToast({ title: "名单为空", description: "请在左侧输入候选人，每行一个名字。" });
      return;
    }
    
    if (need <= 0) {
      showToast({ title: "人数不合法", description: "请输入大于 0 的抽取人数。" });
      return;
    }

    const n = clampPickCount(need, candidates.length);
    if (need > candidates.length) {
      showToast({ title: "人数过多", description: `可用人数仅有 ${candidates.length}，将自动抽取 ${n} 人。` });
    }

    // 滚动动画阶段
    setRolling(true);
    setResult([]);

    const { ROLL_DURATION, TICK_INITIAL } = LOTTERY_ANIMATION;
    const startAt = Date.now();

    while (Date.now() - startAt < ROLL_DURATION) {
      const r = Math.floor(Math.random() * candidates.length);
      setRollName(candidates[r]);
      // 让滚动更有节奏：后半段逐渐减速
      const progress = (Date.now() - startAt) / ROLL_DURATION;
      const eased = TICK_INITIAL + progress * 240; // 60 -> ~300ms
      // eslint-disable-next-line no-await-in-loop
      await sleep(eased);
    }

    // 抽取结果
    const winners = sampleUnique(candidates, n);
    setResult(winners);
    setHistory((prev) => [winners, ...prev].slice(0, UI_STYLES.HISTORY_MAX_RECORDS));

    burstConfetti();
    setRolling(false);
  };

  const resetLottery = () => {
    setRawText("");
    setResult([]);
    setHistory([]);
    setNeed(1);
    setRollName("");
  };

  return {
    // 状态
    rawText,
    need,
    dedupe,
    rolling,
    result,
    history,
    rollName,
    candidates,
    rollRef,
    // 操作函数
    setRawText,
    setNeed,
    setDedupe,
    startDraw,
    resetLottery,
  };
}
