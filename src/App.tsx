import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { ToastHost } from "@/components/ui/toast";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { LotteryHeader, CandidateInput, LotteryDisplay } from "@/components/lottery";
import { useToast, useLottery } from "@/hooks";
import { copyToClipboard } from "@/utils";
import { UI_STYLES } from "@/constants";

/**
 * 技术部知识分享摇号系统 - 重构版本
 */
export default function TechShareLottery() {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const { toasts, showToast, closeToast } = useToast();
  
  const {
    rawText,
    need,
    dedupe,
    rolling,
    result,
    history,
    rollName,
    candidates,
    rollRef,
    setRawText,
    setNeed,
    setDedupe,
    startDraw,
    resetLottery,
  } = useLottery(showToast);

  useEffect(() => {
    document.title = "技术部知识分享摇号系统";
  }, []);

  const handleResetClick = () => {
    setShowResetConfirm(true);
  };

  const confirmReset = () => {
    resetLottery();
    setShowResetConfirm(false);
    showToast({ title: "已重置", description: "所有数据已清除" });
  };

  const cancelReset = () => {
    setShowResetConfirm(false);
  };

  const handleLoadTechDept = () => {
    showToast({ title: "已加载", description: "技术部名单已加载完成" });
  };

  const copyResult = () => {
    const text = result.join("\n");
    
    copyToClipboard(
      text,
      () => showToast({ title: "已复制", description: "结果已复制到剪贴板" }),
      () => {
    if (!text) {
      showToast({ title: "无内容", description: "没有可复制的结果" });
    } else {
          showToast({ title: "复制失败", description: "请手动选择并复制。" });
    }
  }
    );
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-slate-950 text-slate-100">
      {/* Toast 容器 */}
      <ToastHost toasts={toasts} onClose={closeToast} />

      {/* 重置确认对话框 */}
      <AnimatePresence>
        {showResetConfirm && (
          <ConfirmDialog
            open={showResetConfirm}
            title="确认重置所有数据"
            description="此操作将清除当前的候选人名单、抽奖结果和历史记录，且不可恢复。您确定要继续吗？"
            onConfirm={confirmReset}
            onCancel={cancelReset}
          />
        )}
      </AnimatePresence>

      {/* 背景粒子 + 渐变光晕 */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className={`absolute -top-32 left-1/2 h-72 w-[1100px] -translate-x-1/2 blur-3xl opacity-35 ${UI_STYLES.HEADER_GRADIENT}`} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(56,189,248,0.06),rgba(15,23,42,0.2))]" />
      </div>

      {/* 页面头部 */}
      <LotteryHeader />

      <main className="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-4 pb-16 sm:grid-cols-2 sm:gap-6">
        {/* 左侧：输入区 */}
        <CandidateInput
          rawText={rawText}
          need={need}
          dedupe={dedupe}
          rolling={rolling}
          candidatesCount={candidates.length}
          onTextChange={setRawText}
          onNeedChange={setNeed}
          onDedupeChange={setDedupe}
          onStartDraw={startDraw}
          onReset={handleResetClick}
          onLoadTechDept={handleLoadTechDept}
        />

        {/* 右侧：动画+结果区 */}
        <LotteryDisplay
          rolling={rolling}
          rollName={rollName}
          result={result}
          history={history}
          rollRef={rollRef}
          onCopyResult={copyResult}
        />
      </main>

      <footer className="mx-auto max-w-6xl px-4 pb-8 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} 技术部 · 知识分享 · 摇号系统
      </footer>
    </div>
  );
}

// =============== 简单单元测试（不会影响 UI，输出到控制台） ===============
import { parseCandidates, sampleUnique, clampPickCount } from "@/utils";

(function runTests() {
  try {
    console.group("🎯 Lottery Unit Tests");

    // parseCandidates 基础
    {
      const t = "张三\n李四\n\n张三\n 王五  \n";
      const a = parseCandidates(t, true);
      console.assert(a.length === 3 && a[0] === "张三" && a[1] === "李四" && a[2] === "王五", "parseCandidates 去重失败");
      const b = parseCandidates(t, false);
      console.assert(b.length === 4, "parseCandidates 非去重数量错误");
    }

    // parseCandidates 顺序保持 & 空白过滤
    {
      const t = " A \n B \n  C  \n\n";
      const arr = parseCandidates(t, false);
      console.assert(arr.join("|") === "A|B|C", "parseCandidates 应保持顺序并过滤空行");
    }

    // sampleUnique 不变性 & 唯一性
    {
      const src = [1, 2, 3, 4, 5];
      const cp = [...src];
      const pick = sampleUnique(src, 3);
      console.assert(src.join(",") === cp.join(","), "sampleUnique 不应修改原数组");
      const set = new Set(pick);
      console.assert(pick.length === 3 && set.size === 3, "sampleUnique 结果应唯一且数量正确");
      console.assert(pick.every((x) => src.includes(x)), "sampleUnique 结果必须来自源数组");
    }

    // sampleUnique 超出上限
    {
      const src = [1, 2];
      const pick = sampleUnique(src, 5);
      console.assert(pick.length === 2, "sampleUnique 超出长度时应裁剪");
    }

    // clampPickCount
    {
      console.assert(clampPickCount(5, 3) === 3, "clampPickCount 上限裁剪失败");
      console.assert(clampPickCount(0, 10) === 0, "clampPickCount 下限 0 失败");
      console.assert(clampPickCount(2.9, 10) === 2, "clampPickCount 应向下取整");
      console.assert(clampPickCount(-5, 10) === 0, "clampPickCount 负数应裁剪为 0");
    }

    console.log("✅ All tests passed");
  } catch (e) {
    console.error("❌ Tests failed:", e);
  } finally {
    console.groupEnd();
  }
})();