import { RefObject } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shuffle, Copy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { copyToClipboard } from "@/utils";

interface LotteryDisplayProps {
  rolling: boolean;
  rollName: string;
  result: string[];
  history: string[][];
  rollRef: RefObject<HTMLDivElement>;
  onCopyResult: () => void;
}

/**
 * 抽奖显示组件
 */
export function LotteryDisplay({ 
  rolling, 
  rollName, 
  result, 
  history, 
  rollRef,
  onCopyResult 
}: LotteryDisplayProps) {
  return (
    <Card className="border-slate-800 bg-slate-900/60 backdrop-blur">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-slate-100">
          <Shuffle className="h-5 w-5" /> 抽奖显示区
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* 滚动名字 */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/60 p-6">
          <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/5" />
          <div className="mb-3 text-xs uppercase tracking-wider text-slate-400">抽奖滚动</div>
          <div
            ref={rollRef}
            className="h-14 overflow-hidden rounded-xl bg-slate-900/60 shadow-inner"
          >
            <AnimatePresence initial={false} mode="popLayout">
              <motion.div
                key={rolling ? `rolling-${rollName}` : `idle-${result.join(",")}`}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="flex h-14 items-center justify-center px-3 text-lg font-medium text-sky-200"
              >
                {rolling ? rollName || "—" : result.length ? "抽取完成！" : "等待开始…"}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* 结果展示 */}
        <div className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm text-slate-400">最终抽中（{result.length} 人）</div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={onCopyResult} disabled={!result.length}>
                <Copy className="mr-2 h-4 w-4" /> 复制结果
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <AnimatePresence>
              {result.map((name, idx) => (
                <motion.div
                  key={name}
                  initial={{ y: 20, opacity: 0, scale: 0.98 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  transition={{ type: "spring", damping: 18, delay: idx * 0.06 }}
                  className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/60 p-4"
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-sky-500/10 via-fuchsia-500/10 to-purple-400/10 opacity-40" />
                  <div className="relative">
                    <div className="text-sm text-slate-400">NO.{idx + 1}</div>
                    <div className="mt-1 text-xl font-semibold tracking-wide text-slate-100">{name}</div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {!result.length && (
            <div className="rounded-xl border border-dashed border-slate-800 p-6 text-center text-slate-500">
              结果将显示在这里。
            </div>
          )}
        </div>

        {/* 历史记录 */}
        <div className="mt-8">
          <div className="mb-3 text-sm text-slate-400">最近纪录</div>
          {history.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-800 p-4 text-center text-slate-500">
              暂无历史记录。
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((group, i) => (
                <div key={i} className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                  <div className="mb-1 text-xs text-slate-400">第 {i + 1} 次</div>
                  <div className="flex flex-wrap gap-2">
                    {group.map((g) => (
                      <span key={g} className="rounded-lg bg-slate-900/70 px-2 py-1 text-sm text-slate-200">
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
